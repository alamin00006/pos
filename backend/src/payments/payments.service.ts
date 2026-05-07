import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import {
  BankTransactionType,
  PaymentMethod,
  PaymentStatus,
  CashBookType,
  CashBookSource,
  CustomerLedgerType,
  SupplierLedgerType,
} from '@prisma/client';
import { CreatePaymentDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Coordinates Payments business logic, validation, and persistence workflows.
 */
@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Processes payment changes and keeps related ledgers in sync.
   */
  private normalizePaymentMethod(input?: string): PaymentMethod {
    if (!input) return PaymentMethod.CASH;
    const value = input.toUpperCase();
    switch (value) {
      case 'CASH':
        return PaymentMethod.CASH;
      case 'CARD':
        return PaymentMethod.CARD;
      case 'BANK':
      case 'BANK_TRANSFER':
        return PaymentMethod.BANK_TRANSFER;
      case 'MOBILE_MONEY':
      case 'MOBILE_PAYMENT':
        return PaymentMethod.MOBILE_PAYMENT;
      case 'CHEQUE':
        return PaymentMethod.CHEQUE;
      case 'OTHER':
        return PaymentMethod.OTHER;
      default:
        return PaymentMethod.CASH;
    }
  }

  /**
   * Creates a new Payments record after validating the request payload.
   */
  async create(dto: CreatePaymentDto) {
    const paymentDate = dto.date ? new Date(dto.date) : new Date();
    const paymentMethod = this.normalizePaymentMethod(dto.paymentMethod);
    if (paymentMethod !== PaymentMethod.CASH && !dto.bankAccountId) {
      throw new BadRequestException('Bank account is required for non-cash payments');
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.saleId) {
        const sale = await tx.sale.findFirst({ where: { id: dto.saleId, deletedAt: null } });
        if (!sale) throw new NotFoundException('Sale not found');
        if (sale.paymentStatus === PaymentStatus.PAID) {
          throw new BadRequestException('Sale is already fully paid');
        }
        if (dto.amount > Number(sale.dueAmount)) {
          throw new BadRequestException(`Payment amount cannot exceed due amount of ${sale.dueAmount}`);
        }

        const newPaidAmount = Number(sale.paidAmount) + dto.amount;
        const newDueAmount = Math.max(0, Number(sale.total) - newPaidAmount);
        let paymentStatus: PaymentStatus = PaymentStatus.PARTIAL;
        if (newDueAmount <= 0) paymentStatus = PaymentStatus.PAID;

        const payment = await tx.payment.create({
          data: {
            saleId: sale.id,
            customerId: sale.customerId ?? dto.customerId,
            amount: dto.amount,
            paymentMethod,
            note: dto.notes,
            paymentDate,
          },
        });

        await tx.sale.update({
          where: { id: sale.id },
          data: { paidAmount: newPaidAmount, dueAmount: newDueAmount, paymentStatus },
        });

        if (paymentMethod === PaymentMethod.CASH) {
          const lastCashEntry = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
          await tx.cashBook.create({
            data: {
              type: CashBookType.IN,
              source: CashBookSource.PAYMENT_RECEIVED,
              referenceId: sale.id,
              amount: dto.amount,
              balance: (Number(lastCashEntry?.balance) || 0) + dto.amount,
              description: `Sale payment - Invoice #${sale.invoiceNo}`,
            },
          });
        }

        if (paymentMethod !== PaymentMethod.CASH && dto.bankAccountId) {
          await this.recordBankTransaction(
            tx,
            dto.bankAccountId,
            dto.amount,
            BankTransactionType.DEPOSIT,
            sale.id,
            `Sale payment - Invoice #${sale.invoiceNo}`,
          );
        }

        if (sale.customerId) {
          const lastLedger = await tx.customerLedger.findFirst({
            where: { customerId: sale.customerId },
            orderBy: { createdAt: 'desc' },
          });
          const previousBalance = Number(lastLedger?.balance) || 0;
          await tx.customerLedger.create({
            data: {
              customerId: sale.customerId,
              type: CustomerLedgerType.PAYMENT,
              referenceId: sale.id,
              amount: dto.amount,
              balance: previousBalance - dto.amount,
              note: dto.notes || `Payment received - Invoice #${sale.invoiceNo}`,
            },
          });
        }

        return payment;
      }

      if (dto.purchaseId) {
        const purchase = await tx.purchase.findFirst({ where: { id: dto.purchaseId, deletedAt: null } });
        if (!purchase) throw new NotFoundException('Purchase not found');
        if (Number(purchase.dueAmount) <= 0) {
          throw new BadRequestException('This purchase is already fully paid');
        }
        if (dto.amount > Number(purchase.dueAmount)) {
          throw new BadRequestException(`Payment amount cannot exceed due amount of ${purchase.dueAmount}`);
        }

        const newPaidAmount = Number(purchase.paidAmount) + dto.amount;
        const newDueAmount = Math.max(0, Number(purchase.total) - newPaidAmount);
        let paymentStatus: PaymentStatus = PaymentStatus.PARTIAL;
        if (newDueAmount <= 0) paymentStatus = PaymentStatus.PAID;

        const payment = await tx.payment.create({
          data: {
            purchaseId: purchase.id,
            supplierId: purchase.supplierId ?? dto.supplierId,
            amount: dto.amount,
            paymentMethod,
            note: dto.notes,
            paymentDate,
          },
        });

        await tx.purchase.update({
          where: { id: purchase.id },
          data: { paidAmount: newPaidAmount, dueAmount: newDueAmount, paymentStatus },
        });

        if (paymentMethod === PaymentMethod.CASH) {
          const lastCashEntry = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
          await tx.cashBook.create({
            data: {
              type: CashBookType.OUT,
              source: CashBookSource.PAYMENT_MADE,
              referenceId: purchase.id,
              amount: dto.amount,
              balance: (Number(lastCashEntry?.balance) || 0) - dto.amount,
              description: `Purchase payment ${purchase.invoiceNo}`,
            },
          });
        }

        if (paymentMethod !== PaymentMethod.CASH && dto.bankAccountId) {
          await this.recordBankTransaction(
            tx,
            dto.bankAccountId,
            dto.amount,
            BankTransactionType.WITHDRAW,
            purchase.id,
            `Purchase payment ${purchase.invoiceNo}`,
          );
        }

        if (purchase.supplierId) {
          const lastLedger = await tx.supplierLedger.findFirst({
            where: { supplierId: purchase.supplierId },
            orderBy: { createdAt: 'desc' },
          });
          const previousBalance = Number(lastLedger?.balance) || 0;
          await tx.supplierLedger.create({
            data: {
              supplierId: purchase.supplierId,
              type: SupplierLedgerType.PAYMENT,
              referenceId: purchase.id,
              amount: dto.amount,
              balance: previousBalance - dto.amount,
              note: dto.notes || `Payment for purchase ${purchase.invoiceNo}`,
            },
          });
        }

        return payment;
      }

      return tx.payment.create({
        data: {
          saleId: dto.saleId,
          purchaseId: dto.purchaseId,
          customerId: dto.customerId,
          supplierId: dto.supplierId,
          amount: dto.amount,
          paymentMethod,
          note: dto.notes,
          paymentDate,
        },
      });
    });
  }

  /**
   * Handles the record bank transaction workflow for Payments records.
   */
  private async recordBankTransaction(
    tx: any,
    bankAccountId: string,
    amount: number,
    type: BankTransactionType,
    referenceId: string,
    description: string,
  ) {
    const account = await tx.bankAccount.findFirst({ where: { id: bankAccountId, deletedAt: null } });
    if (!account) throw new NotFoundException('Bank account not found');

    const currentBalance = Number(account.currentBalance);
    if (type === BankTransactionType.WITHDRAW && currentBalance < amount) {
      throw new BadRequestException('Insufficient bank balance');
    }

    const balanceAfter =
      type === BankTransactionType.DEPOSIT ? currentBalance + amount : currentBalance - amount;

    await tx.bankTransaction.create({
      data: {
        bankAccountId,
        type,
        amount: new Decimal(amount),
        balanceAfter: new Decimal(balanceAfter),
        referenceId,
        description,
      },
    });

    await tx.bankAccount.update({
      where: { id: bankAccountId },
      data: { currentBalance: new Decimal(balanceAfter) },
    });
  }

  /**
   * Retrieves filtered Payments records for API consumers.
   */
  async findAll(query: PaginationDto & { saleId?: string; purchaseId?: string; startDate?: string; endDate?: string }) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', saleId, purchaseId, startDate, endDate } = query;
    const where: any = { deletedAt: null };

    if (saleId) where.saleId = saleId;
    if (purchaseId) where.purchaseId = purchaseId;
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate);
      if (endDate) where.paymentDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: { sale: true, purchase: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  /**
   * Retrieves a single Payments record by identifier.
   */
  async findOne(id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, deletedAt: null },
      include: { sale: true, purchase: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  /**
   * Removes an existing Payments record while preserving business consistency.
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.payment.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
