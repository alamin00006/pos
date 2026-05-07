import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto, UpdateSaleDto, SaleQueryDto, AddSalePaymentDto, RefundSaleDto } from './dto';
import { paginate, buildPaginationQuery, buildOrderByQuery } from '../common/utils/pagination.util';
import { 
  BankTransactionType,
  SaleStatus, 
  PaymentStatus, 
  PaymentMethod, 
  StockLedgerType, 
  StockLedgerSource, 
  CustomerLedgerType, 
  CashBookType, 
  CashBookSource 
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  addCashBookEntry,
  calculateStock as calculateStockFromLedger,
  nextDocumentNo,
  recordBankTransaction,
} from '../common/utils/pos-accounting.util';

/**
 * Coordinates Sales business logic, validation, and persistence workflows.
 */
@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves filtered Sales records for API consumers.
   */
  async findAll(query: SaleQueryDto, branchId?: string) {
    const { page, limit, sortBy, sortOrder, invoiceNo, customerId, userId, startDate, endDate, status, paymentStatus } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    
    const where: any = { ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}) };
    
    if (invoiceNo) where.invoiceNo = { contains: invoiceNo, mode: 'insensitive' };
    if (customerId) where.customerId = customerId;
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    const [sales, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        skip,
        take,
        orderBy: buildOrderByQuery(sortBy || 'saleDate', sortOrder || 'desc'),
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          user: { select: { id: true, name: true } },
          saleItems: {
            include: { product: { select: { id: true, name: true, productCode: true, costPrice: true } } }
          },
          _count: { select: { payments: true } }
        }
      }),
      this.prisma.sale.count({ where })
    ]);

    const salesWithProfit = sales.map(sale => {
      const costPrice = sale.saleItems.reduce((sum, item) => sum + Number(item.product.costPrice) * item.quantity, 0);
      const profit = Number(sale.total) - costPrice;
      return { ...sale, profit };
    });

    return paginate(salesWithProfit, total, page!, limit!);
  }

  /**
   * Retrieves a single Sales record by identifier.
   */
  async findOne(id: string, branchId?: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}) },
      include: {
        customer: true,
        user: { select: { id: true, name: true, email: true } },
        saleItems: {
          include: { product: { select: { id: true, name: true, productCode: true, barcode: true } } }
        },
        payments: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  /**
   * Handles the get receipt workflow for Sales records.
   */
  async getReceipt(id: string) {
    const sale = await this.findOne(id);
    const companySettings = await this.prisma.setting.findMany({
      where: { key: { in: ['company_name', 'company_address', 'company_phone', 'company_email', 'company_logo'] } }
    });
    const settings = companySettings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    return { sale, company: settings };
  }

  /**
   * Creates a new Sales record after validating the request payload.
   */
  async create(dto: CreateSaleDto, userId?: string, branchId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const invoiceNo = await nextDocumentNo(tx, 'sale_invoice', 'sale', 'invoiceNo', 'SAL');

      // Calculate totals
      let subtotal = 0;
      const itemsWithTotal = dto.items.map(item => {
        const itemTotal = (item.unitPrice * item.quantity) - (item.discount || 0);
        subtotal += itemTotal;
        return { ...item, total: itemTotal };
      });

      const productIds = [...new Set(dto.items.map((item) => item.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, ...this.prisma.notDeleted() },
        select: { id: true, name: true },
      });
      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products not found');
      }

      const productNameById = new Map(products.map((product) => [product.id, product.name]));
      for (const productId of productIds) {
        const requestedQty = dto.items
          .filter((item) => item.productId === productId)
          .reduce((sum, item) => sum + item.quantity, 0);
        const currentStock = await calculateStockFromLedger(tx, productId, branchId);
        if (requestedQty > currentStock) {
          throw new BadRequestException(
            `Insufficient stock for ${productNameById.get(productId) || productId}. Available: ${currentStock}, requested: ${requestedQty}`,
          );
        }
      }

      // Calculate discount
      let discountAmount = dto.discount || 0;
      if (dto.discountType === 'percentage' && dto.discount) {
        discountAmount = (subtotal * dto.discount) / 100;
      }

      const taxAmount = dto.tax || 0;
      const total = subtotal - discountAmount + taxAmount;

      // Calculate paid amount
      let paidAmount = 0;
      if (dto.payments && dto.payments.length > 0) {
        paidAmount = dto.payments.reduce((sum, p) => sum + p.amount, 0);
        for (const payment of dto.payments) {
          const method = payment.paymentMethod || PaymentMethod.CASH;
          if (method !== PaymentMethod.CASH && !payment.bankAccountId && !dto.bankAccountId) {
            throw new BadRequestException('Bank account is required for non-cash sale payments');
          }
        }
      }
      const dueAmount = Math.max(0, total - paidAmount);
      const changeAmount = paidAmount > total ? paidAmount - total : 0;

      // Determine payment status
      let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
      if (paidAmount >= total) paymentStatus = PaymentStatus.PAID;
      else if (paidAmount > 0) paymentStatus = PaymentStatus.PARTIAL;

      // Create sale
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          customerId: dto.customerId,
          userId,
          branchId,
          subtotal,
          discount: discountAmount,
          discountType: dto.discountType || 'fixed',
          tax: taxAmount,
          total,
          paidAmount,
          dueAmount,
          changeAmount,
          status: SaleStatus.COMPLETED,
          paymentStatus,
          paymentMethod: dto.paymentMethod || PaymentMethod.CASH,
          note: dto.note,
          saleDate: dto.saleDate ? new Date(dto.saleDate) : new Date(),
          saleItems: {
            create: itemsWithTotal.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount || 0,
              total: item.total
            }))
          }
        },
        include: { saleItems: true }
      });

      // Create payments if provided
      if (dto.payments && dto.payments.length > 0) {
        for (const payment of dto.payments) {
          await tx.payment.create({
            data: {
              saleId: sale.id,
              customerId: dto.customerId,
              branchId,
              amount: payment.amount,
              paymentMethod: payment.paymentMethod || PaymentMethod.CASH,
              note: payment.note
            }
          });

          if ((payment.paymentMethod || PaymentMethod.CASH) === PaymentMethod.CASH) {
            await addCashBookEntry(
              tx,
              CashBookType.IN,
              CashBookSource.SALE,
              sale.id,
              payment.amount,
              `Sale payment - Invoice #${invoiceNo}`,
              branchId,
            );
          } else {
            const bankAccountId = payment.bankAccountId || dto.bankAccountId;
            if (!bankAccountId) continue;
            await recordBankTransaction(
              tx,
              bankAccountId,
              payment.amount,
              BankTransactionType.DEPOSIT,
              sale.id,
              `Sale payment - Invoice #${invoiceNo}`,
            );
          }
        }
      }

      // Reduce stock for each item
      for (const item of itemsWithTotal) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            branchId,
            type: StockLedgerType.OUT,
            source: StockLedgerSource.SALE,
            referenceId: sale.id,
            quantity: item.quantity,
            note: `Sold - Invoice #${invoiceNo}`
          }
        });
      }

      // Add to customer ledger if customer exists and there's due
      if (dto.customerId && dueAmount > 0) {
        const currentDue = await this.getCustomerDue(tx, dto.customerId);
        await tx.customerLedger.create({
          data: {
            customerId: dto.customerId,
            type: CustomerLedgerType.SALE_DUE,
            referenceId: sale.id,
            amount: dueAmount,
            balance: currentDue + dueAmount,
            note: `Sale due - Invoice #${invoiceNo}`
          }
        });
      }

      return sale;
    });
  }

  /**
   * Updates an existing Sales record with the provided changes.
   */
  async update(id: string, dto: UpdateSaleDto) {
    await this.findOne(id);
    return this.prisma.sale.update({
      where: { id },
      data: {
        customerId: dto.customerId,
        discount: dto.discount,
        discountType: dto.discountType,
        tax: dto.tax,
        status: dto.status,
        paymentStatus: dto.paymentStatus,
        paymentMethod: dto.paymentMethod,
        note: dto.note,
        saleDate: dto.saleDate ? new Date(dto.saleDate) : undefined
      },
      include: { saleItems: true, customer: true }
    });
  }

  /**
   * Removes an existing Sales record while preserving business consistency.
   */
  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id, ...this.prisma.notDeleted() },
        include: {
          saleItems: true,
          payments: { where: { deletedAt: null } },
          returns: {
            where: { deletedAt: null },
            include: { returnItems: true },
          },
        },
      });
      if (!sale) throw new NotFoundException('Sale not found');

      for (const item of sale.saleItems) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            type: StockLedgerType.IN,
            source: StockLedgerSource.ADJUSTMENT,
            referenceId: sale.id,
            quantity: item.quantity,
            note: `Sale delete reversal - Invoice #${sale.invoiceNo}`,
          },
        });
      }

      for (const saleReturn of sale.returns) {
        for (const item of saleReturn.returnItems) {
          await tx.stockLedger.create({
            data: {
              productId: item.productId,
              type: StockLedgerType.OUT,
              source: StockLedgerSource.ADJUSTMENT,
              referenceId: saleReturn.id,
              quantity: item.quantity,
              note: `Return delete reversal - Invoice #${sale.invoiceNo}`,
            },
          });
        }
        await tx.return.update({ where: { id: saleReturn.id }, data: this.prisma.softDelete() });
      }

      const cashPaid = sale.payments
        .filter((payment) => payment.paymentMethod === PaymentMethod.CASH)
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
      if (cashPaid > 0) {
        await addCashBookEntry(
          tx,
          CashBookType.OUT,
          CashBookSource.OTHER,
          sale.id,
          cashPaid,
          `Sale delete payment reversal - Invoice #${sale.invoiceNo}`,
        );
      }

      if (sale.customerId && Number(sale.dueAmount) > 0) {
        const currentDue = await this.getCustomerDue(tx, sale.customerId);
        await tx.customerLedger.create({
          data: {
            customerId: sale.customerId,
            type: CustomerLedgerType.RETURN_ADJUST,
            referenceId: sale.id,
            amount: sale.dueAmount,
            balance: currentDue - Number(sale.dueAmount),
            note: `Sale delete due reversal - Invoice #${sale.invoiceNo}`,
          },
        });
      }

      await tx.payment.updateMany({ where: { saleId: id, deletedAt: null }, data: this.prisma.softDelete() });
      await tx.sale.update({ where: { id }, data: this.prisma.softDelete() });

      return { message: 'Sale deleted successfully' };
    });
  }

  /**
   * Creates a new Sales record after validating the request payload.
   */
  async addPayment(saleId: string, dto: AddSalePaymentDto, branchId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({ where: { id: saleId, ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}) } });
      if (!sale) throw new NotFoundException('Sale not found');

      if (sale.paymentStatus === PaymentStatus.PAID) {
        throw new BadRequestException('Sale is already fully paid');
      }

      if (dto.amount > Number(sale.dueAmount)) {
        throw new BadRequestException(`Payment amount cannot exceed due amount of ${sale.dueAmount}`);
      }

      if ((dto.paymentMethod || PaymentMethod.CASH) !== PaymentMethod.CASH && !dto.bankAccountId) {
        throw new BadRequestException('Bank account is required for non-cash sale payments');
      }

      const newPaidAmount = Number(sale.paidAmount) + dto.amount;
      const newDueAmount = Math.max(0, Number(sale.total) - newPaidAmount);
      
      let paymentStatus: PaymentStatus = PaymentStatus.PARTIAL;
      if (newDueAmount <= 0) paymentStatus = PaymentStatus.PAID;

      // Create payment record
      await tx.payment.create({
        data: {
          saleId,
          customerId: sale.customerId,
          branchId: sale.branchId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod || PaymentMethod.CASH,
          note: dto.note,
          paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date()
        }
      });

      // Update sale
      await tx.sale.update({
        where: { id: saleId },
        data: { paidAmount: newPaidAmount, dueAmount: newDueAmount, paymentStatus }
      });

      // Record in CashBook if cash
      if ((dto.paymentMethod || PaymentMethod.CASH) === PaymentMethod.CASH) {
        await addCashBookEntry(
          tx,
          CashBookType.IN,
          CashBookSource.SALE,
          saleId,
          dto.amount,
          `Sale payment - Invoice #${sale.invoiceNo}`,
          sale.branchId || undefined,
        );
      } else if (dto.bankAccountId) {
        await recordBankTransaction(
          tx,
          dto.bankAccountId,
          dto.amount,
          BankTransactionType.DEPOSIT,
          saleId,
          `Sale payment - Invoice #${sale.invoiceNo}`,
        );
      }

      // Update customer ledger if customer exists
      if (sale.customerId) {
        const currentDue = await this.getCustomerDue(tx, sale.customerId);
        await tx.customerLedger.create({
          data: {
            customerId: sale.customerId,
            type: CustomerLedgerType.PAYMENT,
            referenceId: saleId,
            amount: dto.amount,
            balance: currentDue - dto.amount,
            note: `Payment received - Invoice #${sale.invoiceNo}`
          }
        });
      }

      return { message: 'Payment added successfully', newDueAmount, paymentStatus };
    });
  }

  /**
   * Creates a new record using an existing Sales record as the source.
   */
  async duplicate(id: string, userId?: string) {
    const originalSale = await this.findOne(id);
    
    const items = originalSale.saleItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount)
    }));

    return this.create({
      customerId: originalSale.customerId || undefined,
      items,
      discount: Number(originalSale.discount),
      discountType: originalSale.discountType || 'fixed',
      tax: Number(originalSale.tax),
      paymentMethod: originalSale.paymentMethod,
      note: `Duplicated from Invoice #${originalSale.invoiceNo}`
    }, userId);
  }

  /**
   * Processes refund data and updates stock, payment, and ledger state.
   */
  async refund(saleId: string, dto: RefundSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id: saleId, ...this.prisma.notDeleted() },
        include: {
          saleItems: true,
          returns: {
            where: { deletedAt: null },
            include: { returnItems: true },
          },
        }
      });
      if (!sale) throw new NotFoundException('Sale not found');
      if (sale.status === SaleStatus.REFUNDED) {
        throw new BadRequestException('Sale is already fully refunded');
      }

      const soldQty = new Map<string, number>();
      for (const item of sale.saleItems) {
        soldQty.set(item.productId, (soldQty.get(item.productId) || 0) + item.quantity);
      }

      const returnedQty = new Map<string, number>();
      for (const saleReturn of sale.returns) {
        for (const item of saleReturn.returnItems) {
          returnedQty.set(item.productId, (returnedQty.get(item.productId) || 0) + item.quantity);
        }
      }

      for (const item of dto.items) {
        const remainingQty = (soldQty.get(item.productId) || 0) - (returnedQty.get(item.productId) || 0);
        if (item.quantity > remainingQty) {
          throw new BadRequestException(`Return quantity exceeds sold quantity for product ${item.productId}`);
        }
      }

      // Generate return number
      const returnNo = await nextDocumentNo(tx, 'return_number', 'return', 'returnNo', 'RET');

      const saleItemByProduct = new Map(sale.saleItems.map((item) => [item.productId, item]));
      const returnItems = dto.items.map((item) => {
        const soldItem = saleItemByProduct.get(item.productId);
        if (!soldItem) {
          throw new BadRequestException(`Product ${item.productId} was not sold in this invoice`);
        }

        const unitPrice = Number.isFinite(Number(item.unitPrice))
          ? Number(item.unitPrice)
          : Number(soldItem.unitPrice);

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          total: unitPrice * item.quantity,
        };
      });

      // Calculate return total
      const returnTotal = returnItems.reduce((sum, item) => sum + item.total, 0);

      // Create return
      const saleReturn = await tx.return.create({
        data: {
          returnNo,
          saleId,
          total: returnTotal,
          note: dto.note,
          returnItems: {
            create: returnItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            }))
          }
        },
        include: { returnItems: true }
      });

      // Add stock back for returned items
      for (const item of returnItems) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            type: StockLedgerType.IN,
            source: StockLedgerSource.RETURN,
            referenceId: saleReturn.id,
            quantity: item.quantity,
            note: `Return - ${returnNo}`
          }
        });
      }

      // Update customer ledger if customer exists
      if (sale.customerId) {
        const currentDue = await this.getCustomerDue(tx, sale.customerId);
        await tx.customerLedger.create({
          data: {
            customerId: sale.customerId,
            type: CustomerLedgerType.RETURN_ADJUST,
            referenceId: saleReturn.id,
            amount: returnTotal,
            balance: currentDue - returnTotal,
            note: `Return adjustment - ${returnNo}`
          }
        });
      }

      // Update sale status if fully refunded
      const totalRefunded = await tx.returnItem.aggregate({
        where: { return: { saleId, deletedAt: null } },
        _sum: { total: true }
      });

      const refundedAmount = Number(totalRefunded._sum.total || 0);
      const effectiveSaleTotal = Math.max(0, Number(sale.total) - refundedAmount);
      const newPaidAmount = Math.min(Number(sale.paidAmount), effectiveSaleTotal);
      const newDueAmount = Math.max(0, effectiveSaleTotal - newPaidAmount);
      const paymentStatus =
        newDueAmount <= 0 ? PaymentStatus.PAID : newPaidAmount > 0 ? PaymentStatus.PARTIAL : PaymentStatus.PENDING;

      await tx.sale.update({
        where: { id: saleId },
        data: {
          paidAmount: newPaidAmount,
          dueAmount: newDueAmount,
          paymentStatus,
          status: refundedAmount >= Number(sale.total) ? SaleStatus.REFUNDED : sale.status,
        }
      });

      return saleReturn;
    });
  }

  /**
   * Handles the get today sales workflow for Sales records.
   */
  async getTodaySales(branchId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await this.prisma.sale.findMany({
      where: {
        saleDate: { gte: today, lt: tomorrow },
        ...(branchId ? { branchId } : {}),
        ...this.prisma.notDeleted()
      },
      include: { saleItems: { include: { product: true } }, customer: true }
    });

    const totalSold = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalReceived = sales.reduce((sum, s) => sum + Number(s.paidAmount), 0);
    const totalDue = sales.reduce((sum, s) => sum + Number(s.dueAmount), 0);
    
    return { count: sales.length, totalSold, totalReceived, totalDue, sales };
  }

  /**
   * Builds the requested Sales report from current business data.
   */
  async getSalesReport(query: SaleQueryDto, branchId?: string) {
    const { startDate, endDate, customerId } = query;
    const where: any = { ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}) };
    
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }
    if (customerId) where.customerId = customerId;

    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        customer: { select: { name: true } },
        saleItems: { include: { product: { select: { costPrice: true } } } }
      },
      orderBy: { saleDate: 'desc' }
    });

    let totalSales = 0;
    let totalCost = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let totalPaid = 0;
    let totalDue = 0;

    for (const sale of sales) {
      totalSales += Number(sale.total);
      totalDiscount += Number(sale.discount);
      totalTax += Number(sale.tax);
      totalPaid += Number(sale.paidAmount);
      totalDue += Number(sale.dueAmount);
      
      for (const item of sale.saleItems) {
        totalCost += Number(item.product.costPrice) * item.quantity;
      }
    }

    const totalProfit = totalSales - totalCost;

    return {
      summary: { totalSales, totalCost, totalProfit, totalDiscount, totalTax, totalPaid, totalDue, count: sales.length },
      sales
    };
  }

  /**
   * Handles the get customer due workflow for Sales records.
   */
  private async getCustomerDue(tx: any, customerId: string): Promise<number> {
    const ledger = await tx.customerLedger.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 1
    });
    return Number(ledger[0]?.balance) || 0;
  }

}
