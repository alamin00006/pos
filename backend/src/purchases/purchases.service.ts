import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto, UpdatePurchaseDto, PurchaseQueryDto, AddPurchasePaymentDto } from './dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import {
  BankTransactionType,
  PaymentMethod,
  PaymentStatus,
  PurchaseStatus,
  StockLedgerType,
  StockLedgerSource,
  SupplierLedgerType,
  CashBookType,
  CashBookSource,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  addCashBookEntry,
  nextDocumentNo,
  recordBankTransaction,
} from '../common/utils/pos-accounting.util';

/**
 * Coordinates Purchases business logic, validation, and persistence workflows.
 */
@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new Purchases record after validating the request payload.
   */
  async create(dto: CreatePurchaseDto, userId?: string, branchId?: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: dto.supplierId, deletedAt: null, ...(branchId ? { branchId } : {}) } as any,
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Validate products exist
    const productIds = dto.items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    // Calculate totals
    const subtotal = dto.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const total = subtotal - (dto.discount || 0) + (dto.tax || 0) + (dto.shippingCost || 0);
    const paidAmount = dto.paidAmount || 0;
    const dueAmount = total - paidAmount;

    if (paidAmount > total) {
      throw new BadRequestException(`Paid amount cannot exceed purchase total of ${total}`);
    }

    if (paidAmount > 0 && (dto.paymentMethod || PaymentMethod.CASH) !== PaymentMethod.CASH && !dto.bankAccountId) {
      throw new BadRequestException('Bank account is required for non-cash purchase payments');
    }

    // Determine payment status
    let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
    if (paidAmount >= total) {
      paymentStatus = PaymentStatus.PAID;
    } else if (paidAmount > 0) {
      paymentStatus = PaymentStatus.PARTIAL;
    }

    return this.prisma.$transaction(async (tx) => {
      const invoiceNo = await nextDocumentNo(tx, 'purchase_invoice', 'purchase', 'invoiceNo', 'PUR');

      // Create purchase
      const purchase = await tx.purchase.create({
        data: {
          invoiceNo,
          supplierId: dto.supplierId,
          userId,
          branchId,
          subtotal: new Decimal(subtotal),
          discount: new Decimal(dto.discount || 0),
          tax: new Decimal(dto.tax || 0),
          shippingCost: new Decimal(dto.shippingCost || 0),
          total: new Decimal(total),
          paidAmount: new Decimal(paidAmount),
          dueAmount: new Decimal(dueAmount),
          status: PurchaseStatus.RECEIVED,
          paymentStatus,
          note: dto.note,
          purchaseItems: {
            create: dto.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitPrice),
              total: new Decimal(item.quantity * item.unitPrice),
            })),
          },
        },
        include: {
          supplier: true,
          purchaseItems: { include: { product: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      // Update stock ledger for each item (IN)
      for (const item of dto.items) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            branchId,
            type: StockLedgerType.IN,
            source: StockLedgerSource.PURCHASE,
            referenceId: purchase.id,
            quantity: item.quantity,
            note: `Purchase ${invoiceNo}`,
          },
        });
      }

      // Get last supplier ledger balance
      const lastLedger = await tx.supplierLedger.findFirst({
        where: { supplierId: dto.supplierId },
        orderBy: { createdAt: 'desc' },
      });
      const previousBalance = lastLedger?.balance || supplier.openingBalance;

      // Create supplier ledger entry for purchase due
      if (dueAmount > 0) {
        await tx.supplierLedger.create({
          data: {
            supplierId: dto.supplierId,
            type: SupplierLedgerType.PURCHASE_DUE,
            referenceId: purchase.id,
            amount: new Decimal(dueAmount),
            balance: new Decimal(Number(previousBalance) + dueAmount),
            note: `Purchase ${invoiceNo}`,
          },
        });
      }

      // Create payment record and cash book entry if paid
      if (paidAmount > 0) {
        await tx.payment.create({
          data: {
            purchaseId: purchase.id,
            supplierId: dto.supplierId,
            branchId,
            amount: new Decimal(paidAmount),
            paymentMethod: dto.paymentMethod,
            note: `Payment for purchase ${invoiceNo}`,
          },
        });

        if ((dto.paymentMethod || PaymentMethod.CASH) === PaymentMethod.CASH) {
          await addCashBookEntry(
            tx,
            CashBookType.OUT,
            CashBookSource.PURCHASE,
            purchase.id,
            paidAmount,
            `Purchase payment ${invoiceNo}`,
            branchId,
          );
        } else if (dto.bankAccountId) {
          await recordBankTransaction(
            tx,
            dto.bankAccountId,
            paidAmount,
            BankTransactionType.WITHDRAW,
            purchase.id,
            `Purchase payment ${invoiceNo}`,
          );
        }
      }

      return purchase;
    });
  }

  /**
   * Retrieves filtered Purchases records for API consumers.
   */
  async findAll(query: PurchaseQueryDto, branchId?: string) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', supplierId, status, paymentStatus, startDate, endDate } = query;

    const where: any = { deletedAt: null, ...(branchId ? { branchId } : {}) };

    if (search) {
      where.OR = [
        { invoiceNo: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (supplierId) where.supplierId = supplierId;
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) where.purchaseDate.gte = new Date(startDate);
      if (endDate) where.purchaseDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.purchase.findMany({
        where,
        include: {
          supplier: true,
          purchaseItems: { include: { product: true } },
          user: { select: { id: true, name: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.purchase.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  /**
   * Retrieves a single Purchases record by identifier.
   */
  async findOne(id: string, branchId?: string) {
    const purchase = await this.prisma.purchase.findFirst({
      where: { id, deletedAt: null, ...(branchId ? { branchId } : {}) },
      include: {
        supplier: true,
        purchaseItems: { include: { product: true } },
        payments: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return purchase;
  }

  /**
   * Updates an existing Purchases record with the provided changes.
   */
  async update(id: string, dto: UpdatePurchaseDto) {
    const purchase = await this.findOne(id);

    // Recalculate total if financial fields changed
    let updateData: any = { ...dto };

    if (dto.discount !== undefined || dto.tax !== undefined || dto.shippingCost !== undefined) {
      const subtotal = Number(purchase.subtotal);
      const discount = dto.discount ?? Number(purchase.discount);
      const tax = dto.tax ?? Number(purchase.tax);
      const shippingCost = dto.shippingCost ?? Number(purchase.shippingCost);

      const total = subtotal - discount + tax + shippingCost;
      const dueAmount = total - Number(purchase.paidAmount);

      updateData.total = new Decimal(total);
      updateData.dueAmount = new Decimal(dueAmount);

      // Update payment status
      if (dueAmount <= 0) {
        updateData.paymentStatus = PaymentStatus.PAID;
      } else if (Number(purchase.paidAmount) > 0) {
        updateData.paymentStatus = PaymentStatus.PARTIAL;
      } else {
        updateData.paymentStatus = PaymentStatus.PENDING;
      }
    }

    return this.prisma.purchase.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
        purchaseItems: { include: { product: true } },
      },
    });
  }

  /**
   * Creates a new Purchases record after validating the request payload.
   */
  async addPayment(id: string, dto: AddPurchasePaymentDto, branchId?: string) {
    const purchase = await this.findOne(id, branchId);

    if (Number(purchase.dueAmount) <= 0) {
      throw new BadRequestException('This purchase is already fully paid');
    }

    if (dto.amount > Number(purchase.dueAmount)) {
      throw new BadRequestException(`Payment amount cannot exceed due amount of ${purchase.dueAmount}`);
    }

    if ((dto.paymentMethod || PaymentMethod.CASH) !== PaymentMethod.CASH && !dto.bankAccountId) {
      throw new BadRequestException('Bank account is required for non-cash purchase payments');
    }

    return this.prisma.$transaction(async (tx) => {
      const newPaidAmount = Number(purchase.paidAmount) + dto.amount;
      const newDueAmount = Number(purchase.total) - newPaidAmount;

      let paymentStatus: PaymentStatus = PaymentStatus.PARTIAL;
      if (newDueAmount <= 0) {
        paymentStatus = PaymentStatus.PAID;
      }

      // Update purchase
      const updatedPurchase = await tx.purchase.update({
        where: { id },
        data: {
          paidAmount: new Decimal(newPaidAmount),
          dueAmount: new Decimal(newDueAmount),
          paymentStatus,
        },
        include: {
          supplier: true,
          purchaseItems: { include: { product: true } },
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          purchaseId: id,
          supplierId: purchase.supplierId,
          branchId: purchase.branchId,
          amount: new Decimal(dto.amount),
          paymentMethod: dto.paymentMethod,
          note: dto.note || `Payment for purchase ${purchase.invoiceNo}`,
        },
      });

      // Update supplier ledger
      const lastLedger = await tx.supplierLedger.findFirst({
        where: { supplierId: purchase.supplierId },
        orderBy: { createdAt: 'desc' },
      });
      const previousBalance = lastLedger?.balance || new Decimal(0);

      await tx.supplierLedger.create({
        data: {
          supplierId: purchase.supplierId,
          type: SupplierLedgerType.PAYMENT,
          referenceId: id,
          amount: new Decimal(dto.amount),
          balance: new Decimal(Number(previousBalance) - dto.amount),
          note: `Payment for purchase ${purchase.invoiceNo}`,
        },
      });

      if ((dto.paymentMethod || PaymentMethod.CASH) === PaymentMethod.CASH) {
        await addCashBookEntry(
          tx,
          CashBookType.OUT,
          CashBookSource.PAYMENT_MADE,
          id,
          dto.amount,
          `Purchase payment ${purchase.invoiceNo}`,
          purchase.branchId || undefined,
        );
      } else if (dto.bankAccountId) {
        await recordBankTransaction(
          tx,
          dto.bankAccountId,
          dto.amount,
          BankTransactionType.WITHDRAW,
          id,
          `Purchase payment ${purchase.invoiceNo}`,
        );
      }

      return updatedPurchase;
    });
  }

  /**
   * Handles the get receipt workflow for Purchases records.
   */
  async getReceipt(id: string) {
    const purchase = await this.findOne(id);

    return {
      ...purchase,
      receiptType: 'PURCHASE',
      generatedAt: new Date(),
    };
  }

  /**
   * Removes an existing Purchases record while preserving business consistency.
   */
  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findFirst({
        where: { id, deletedAt: null },
        include: {
          purchaseItems: true,
          payments: { where: { deletedAt: null } },
        },
      });
      if (!purchase) throw new NotFoundException('Purchase not found');

      for (const item of purchase.purchaseItems) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            type: StockLedgerType.OUT,
            source: StockLedgerSource.ADJUSTMENT,
            referenceId: purchase.id,
            quantity: item.quantity,
            note: `Purchase delete reversal - Invoice #${purchase.invoiceNo}`,
          },
        });
      }

      const cashPaid = purchase.payments
        .filter((payment) => payment.paymentMethod === PaymentMethod.CASH)
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
      if (cashPaid > 0) {
        await addCashBookEntry(
          tx,
          CashBookType.IN,
          CashBookSource.OTHER,
          purchase.id,
          cashPaid,
          `Purchase delete payment reversal - Invoice #${purchase.invoiceNo}`,
        );
      }

      if (Number(purchase.dueAmount) > 0) {
        const lastLedger = await tx.supplierLedger.findFirst({
          where: { supplierId: purchase.supplierId },
          orderBy: { createdAt: 'desc' },
        });
        const previousBalance = Number(lastLedger?.balance) || 0;
        await tx.supplierLedger.create({
          data: {
            supplierId: purchase.supplierId,
            type: SupplierLedgerType.RETURN_ADJUST,
            referenceId: purchase.id,
            amount: purchase.dueAmount,
            balance: previousBalance - Number(purchase.dueAmount),
            note: `Purchase delete due reversal - Invoice #${purchase.invoiceNo}`,
          },
        });
      }

      await tx.payment.updateMany({ where: { purchaseId: id, deletedAt: null }, data: this.prisma.softDelete() });
      await tx.purchase.update({ where: { id }, data: this.prisma.softDelete() });

      return { message: 'Purchase deleted successfully' };
    });
  }

  /**
   * Handles the get supplier purchases workflow for Purchases records.
   */
  async getSupplierPurchases(supplierId: string, query: PurchaseQueryDto) {
    return this.findAll({ ...query, supplierId });
  }
}
