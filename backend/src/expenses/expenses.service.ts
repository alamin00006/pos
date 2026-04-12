import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { BankTransactionType, CashBookType, CashBookSource, PaymentMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { addCashBookEntry, recordBankTransaction } from '../common/utils/pos-accounting.util';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  private normalizePaymentMethod(input?: string): PaymentMethod {
    if (!input) return PaymentMethod.CASH;
    const value = input.toUpperCase();
    if (value === 'BANK') return PaymentMethod.BANK_TRANSFER;
    if (value === 'MOBILE_MONEY') return PaymentMethod.MOBILE_PAYMENT;
    if (value in PaymentMethod) return value as PaymentMethod;
    return PaymentMethod.CASH;
  }

  async create(dto: CreateExpenseDto) {
    if (!dto.categoryId) {
      throw new BadRequestException('Expense category is required');
    }
    const paymentMethod = this.normalizePaymentMethod(dto.paymentMethod);
    if (paymentMethod !== PaymentMethod.CASH && !dto.bankAccountId) {
      throw new BadRequestException('Bank account is required for non-cash expenses');
    }

    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          expenseCategoryId: dto.categoryId,
          bankAccountId: dto.bankAccountId,
          amount: new Decimal(dto.amount),
          paymentMethod,
          description: dto.description || dto.title,
          reference: dto.reference,
          expenseDate: dto.date ? new Date(dto.date) : new Date(),
        },
        include: { expenseCategory: true, bankAccount: true },
      });

      if (paymentMethod === PaymentMethod.CASH) {
        await addCashBookEntry(
          tx,
          CashBookType.OUT,
          CashBookSource.EXPENSE,
          expense.id,
          dto.amount,
          dto.description || 'Expense',
        );
      } else if (dto.bankAccountId) {
        await recordBankTransaction(
          tx,
          dto.bankAccountId,
          dto.amount,
          BankTransactionType.WITHDRAW,
          expense.id,
          dto.description || 'Expense',
        );
      }

      return expense;
    });
  }

  async findAll(query: PaginationDto & { expenseCategoryId?: string; categoryId?: string; startDate?: string; endDate?: string }) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', expenseCategoryId, categoryId, startDate, endDate } = query;
    const where: any = { deletedAt: null };

    if (search) where.description = { contains: search, mode: 'insensitive' };
    if (expenseCategoryId || categoryId) where.expenseCategoryId = expenseCategoryId || categoryId;
    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) where.expenseDate.gte = new Date(startDate);
      if (endDate) where.expenseDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        include: { expenseCategory: true, bankAccount: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, deletedAt: null },
      include: { expenseCategory: true, bankAccount: true },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async update(id: string, dto: UpdateExpenseDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if ((dto as any).categoryId) {
      data.expenseCategoryId = (dto as any).categoryId;
      delete data.categoryId;
    }
    if ((dto as any).date) {
      data.expenseDate = new Date((dto as any).date);
      delete data.date;
    }
    if ((dto as any).title && !data.description) {
      data.description = (dto as any).title;
      delete data.title;
    }
    if ((dto as any).paymentMethod) {
      data.paymentMethod = this.normalizePaymentMethod((dto as any).paymentMethod);
    }
    return this.prisma.expense.update({
      where: { id },
      data,
      include: { expenseCategory: true },
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.findFirst({ where: { id, deletedAt: null } });
      if (!expense) throw new NotFoundException('Expense not found');

      if (expense.paymentMethod === PaymentMethod.CASH) {
        await addCashBookEntry(
          tx,
          CashBookType.IN,
          CashBookSource.OTHER,
          expense.id,
          Number(expense.amount),
          `Expense delete reversal - ${expense.description || expense.reference || expense.id}`,
        );
      } else if (expense.bankAccountId) {
        await recordBankTransaction(
          tx,
          expense.bankAccountId,
          Number(expense.amount),
          BankTransactionType.DEPOSIT,
          expense.id,
          `Expense delete reversal - ${expense.description || expense.reference || expense.id}`,
        );
      }

      await tx.expense.update({ where: { id }, data: { deletedAt: new Date() } });
      return { message: 'Expense deleted successfully' };
    });
  }
}
