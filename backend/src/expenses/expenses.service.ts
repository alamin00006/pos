import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { CashBookType, CashBookSource } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          expenseCategoryId: dto.expenseCategoryId,
          bankAccountId: dto.bankAccountId,
          amount: new Decimal(dto.amount),
          paymentMethod: dto.paymentMethod,
          description: dto.description,
          reference: dto.reference,
          expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date(),
        },
        include: { expenseCategory: true, bankAccount: true },
      });

      const lastCashBook = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
      const cashBalance = lastCashBook?.balance || new Decimal(0);

      await tx.cashBook.create({
        data: {
          type: CashBookType.OUT,
          source: CashBookSource.EXPENSE,
          referenceId: expense.id,
          amount: new Decimal(dto.amount),
          balance: new Decimal(Number(cashBalance) - dto.amount),
          description: dto.description || 'Expense',
        },
      });

      return expense;
    });
  }

  async findAll(query: PaginationDto & { expenseCategoryId?: string; startDate?: string; endDate?: string }) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', expenseCategoryId, startDate, endDate } = query;
    const where: any = { deletedAt: null };

    if (search) where.description = { contains: search, mode: 'insensitive' };
    if (expenseCategoryId) where.expenseCategoryId = expenseCategoryId;
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
    const expense = await this.prisma.expense.findUnique({
      where: { id, deletedAt: null },
      include: { expenseCategory: true, bankAccount: true },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.expense.update({
      where: { id },
      data: dto,
      include: { expenseCategory: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.expense.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
