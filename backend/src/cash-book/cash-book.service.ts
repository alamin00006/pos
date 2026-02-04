import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class CashBookService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { startDate?: string; endDate?: string; type?: string; source?: string }) {
    const { page = 1, limit = 10, sortBy = 'entryDate', sortOrder = 'desc', startDate, endDate, type, source } = query;
    const where: any = {};

    if (type) where.type = type;
    if (source) where.source = source;
    if (startDate || endDate) {
      where.entryDate = {};
      if (startDate) where.entryDate.gte = new Date(startDate);
      if (endDate) where.entryDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.cashBook.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.cashBook.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async getBalance() {
    const lastEntry = await this.prisma.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
    return { balance: lastEntry?.balance || 0 };
  }

  async getSummary(query: { startDate?: string; endDate?: string }) {
    const where: any = {};
    if (query.startDate || query.endDate) {
      where.entryDate = {};
      if (query.startDate) where.entryDate.gte = new Date(query.startDate);
      if (query.endDate) where.entryDate.lte = new Date(query.endDate);
    }

    const [cashIn, cashOut] = await Promise.all([
      this.prisma.cashBook.aggregate({ where: { ...where, type: 'IN' }, _sum: { amount: true } }),
      this.prisma.cashBook.aggregate({ where: { ...where, type: 'OUT' }, _sum: { amount: true } }),
    ]);

    const totalIn = Number(cashIn._sum.amount || 0);
    const totalOut = Number(cashOut._sum.amount || 0);

    return {
      totalCashIn: totalIn,
      totalCashOut: totalOut,
      netCash: totalIn - totalOut,
    };
  }
}
