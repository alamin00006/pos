import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class ExpenseCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const existing = await this.prisma.expenseCategory.findFirst({
      where: { name: dto.name, deletedAt: null },
    });
    if (existing) throw new ConflictException('Expense category already exists');
    return this.prisma.expenseCategory.create({ data: dto });
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = query;
    const where: any = { deletedAt: null };
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.expenseCategory.findMany({
        where,
        include: { _count: { select: { expenses: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.expenseCategory.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const category = await this.prisma.expenseCategory.findUnique({ where: { id, deletedAt: null } });
    if (!category) throw new NotFoundException('Expense category not found');
    return category;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.expenseCategory.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.expenseCategory.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
