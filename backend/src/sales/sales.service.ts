import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto, UpdateSaleDto, SaleQueryDto, AddSalePaymentDto, RefundSaleDto } from './dto';
import { paginate, buildPaginationQuery, buildOrderByQuery } from '../common/utils/pagination.util';
import { 
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

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SaleQueryDto) {
    const { page, limit, sortBy, sortOrder, invoiceNo, customerId, userId, startDate, endDate, status, paymentStatus } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    
    const where: any = { ...this.prisma.notDeleted() };
    
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
            include: { product: { select: { id: true, name: true, productCode: true } } }
          },
          _count: { select: { payments: true } }
        }
      }),
      this.prisma.sale.count({ where })
    ]);

    const salesWithProfit = sales.map(sale => {
      const costPrice = sale.saleItems.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
      const profit = Number(sale.total) - costPrice;
      return { ...sale, profit };
    });

    return paginate(salesWithProfit, total, page!, limit!);
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, ...this.prisma.notDeleted() },
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

  async getReceipt(id: string) {
    const sale = await this.findOne(id);
    const companySettings = await this.prisma.setting.findMany({
      where: { key: { in: ['company_name', 'company_address', 'company_phone', 'company_email', 'company_logo'] } }
    });
    const settings = companySettings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    return { sale, company: settings };
  }

  async create(dto: CreateSaleDto, userId?: string) {
    return this.prisma.$transaction(async (tx) => {
      // Generate invoice number
      const lastSale = await tx.sale.findFirst({ orderBy: { createdAt: 'desc' }, select: { invoiceNo: true } });
      const nextNum = lastSale ? parseInt(lastSale.invoiceNo) + 1 : 1;
      const invoiceNo = String(nextNum).padStart(6, '0');

      // Calculate totals
      let subtotal = 0;
      const itemsWithTotal = dto.items.map(item => {
        const itemTotal = (item.unitPrice * item.quantity) - (item.discount || 0);
        subtotal += itemTotal;
        return { ...item, total: itemTotal };
      });

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
              amount: payment.amount,
              paymentMethod: payment.paymentMethod || PaymentMethod.CASH,
              note: payment.note
            }
          });

          // Record in CashBook if cash payment
          if ((payment.paymentMethod || PaymentMethod.CASH) === PaymentMethod.CASH) {
            const lastCashEntry = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
            await tx.cashBook.create({
              data: {
                type: CashBookType.IN,
                source: CashBookSource.SALE,
                referenceId: sale.id,
                amount: payment.amount,
                balance: (Number(lastCashEntry?.balance) || 0) + payment.amount,
                description: `Sale payment - Invoice #${invoiceNo}`
              }
            });
          }
        }
      }

      // Reduce stock for each item
      for (const item of itemsWithTotal) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
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

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.sale.update({
      where: { id },
      data: this.prisma.softDelete()
    });
    return { message: 'Sale deleted successfully' };
  }

  async addPayment(saleId: string, dto: AddSalePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({ where: { id: saleId, ...this.prisma.notDeleted() } });
      if (!sale) throw new NotFoundException('Sale not found');

      if (sale.paymentStatus === PaymentStatus.PAID) {
        throw new BadRequestException('Sale is already fully paid');
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
        const lastCashEntry = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
        await tx.cashBook.create({
          data: {
            type: CashBookType.IN,
            source: CashBookSource.SALE,
            referenceId: saleId,
            amount: dto.amount,
            balance: (Number(lastCashEntry?.balance) || 0) + dto.amount,
            description: `Sale payment - Invoice #${sale.invoiceNo}`
          }
        });
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

  async refund(saleId: string, dto: RefundSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id: saleId, ...this.prisma.notDeleted() },
        include: { saleItems: true }
      });
      if (!sale) throw new NotFoundException('Sale not found');

      // Generate return number
      const lastReturn = await tx.return.findFirst({ orderBy: { createdAt: 'desc' }, select: { returnNo: true } });
      const nextNum = lastReturn ? parseInt(lastReturn.returnNo.replace('RTN-', '')) + 1 : 1;
      const returnNo = `RTN-${String(nextNum).padStart(6, '0')}`;

      // Calculate return total
      const returnTotal = dto.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

      // Create return
      const saleReturn = await tx.return.create({
        data: {
          returnNo,
          saleId,
          total: returnTotal,
          note: dto.note,
          returnItems: {
            create: dto.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.unitPrice * item.quantity
            }))
          }
        },
        include: { returnItems: true }
      });

      // Add stock back for returned items
      for (const item of dto.items) {
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
        where: { return: { saleId } },
        _sum: { total: true }
      });

      if (Number(totalRefunded._sum.total) >= Number(sale.total)) {
        await tx.sale.update({
          where: { id: saleId },
          data: { status: SaleStatus.REFUNDED }
        });
      }

      return saleReturn;
    });
  }

  async getTodaySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await this.prisma.sale.findMany({
      where: {
        saleDate: { gte: today, lt: tomorrow },
        ...this.prisma.notDeleted()
      },
      include: { saleItems: { include: { product: true } }, customer: true }
    });

    const totalSold = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalReceived = sales.reduce((sum, s) => sum + Number(s.paidAmount), 0);
    const totalDue = sales.reduce((sum, s) => sum + Number(s.dueAmount), 0);
    
    return { count: sales.length, totalSold, totalReceived, totalDue, sales };
  }

  async getSalesReport(query: SaleQueryDto) {
    const { startDate, endDate, customerId } = query;
    const where: any = { ...this.prisma.notDeleted() };
    
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

  private async getCustomerDue(tx: any, customerId: string): Promise<number> {
    const ledger = await tx.customerLedger.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 1
    });
    return Number(ledger[0]?.balance) || 0;
  }
}
