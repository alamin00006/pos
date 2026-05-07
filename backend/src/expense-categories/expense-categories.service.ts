import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

/**
 * Coordinates Expense Categories business logic, validation, and persistence workflows.
 */
@Injectable()
export class ExpenseCategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new Expense Categories record after validating the request payload.
   */
  async create(dto: any) {
    const existing = await this.prisma.expenseCategory.findFirst({
      where: { name: dto.name, deletedAt: null },
    });
    if (existing) throw new ConflictException('Expense category already exists');
    return this.prisma.expenseCategory.create({ data: dto });
  }

  /**
   * Retrieves filtered Expense Categories records for API consumers.
   */
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

  /**
   * Retrieves a single Expense Categories record by identifier.
   */
  async findOne(id: string) {
    const category = await this.prisma.expenseCategory.findFirst({ where: { id, deletedAt: null } });
    if (!category) throw new NotFoundException('Expense category not found');
    return category;
  }

  /**
   * Updates an existing Expense Categories record with the provided changes.
   */
  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.expenseCategory.update({ where: { id }, data: dto });
  }

  /**
   * Removes an existing Expense Categories record while preserving business consistency.
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.expenseCategory.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
