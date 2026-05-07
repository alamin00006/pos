import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';

/**
 * Coordinates Categories business logic, validation, and persistence workflows.
 */
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves filtered Categories records for API consumers.
   */
  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ['name', 'code']);

    const where = {
      ...this.prisma.notDeleted(),
      ...searchQuery,
    };

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          _count: { select: { products: true, subcategories: true } },
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    const formatted = categories.map((cat) => ({
      ...cat,
      productsCount: cat._count.products,
      subcategoriesCount: cat._count.subcategories,
      _count: undefined,
    }));

    return paginate(formatted, total, page!, limit!);
  }

  /**
   * Retrieves a single Categories record by identifier.
   */
  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, ...this.prisma.notDeleted() },
      include: {
        subcategories: { where: this.prisma.notDeleted() },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      ...category,
      productsCount: category._count.products,
      _count: undefined,
    };
  }

  /**
   * Creates a new Categories record after validating the request payload.
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name, ...this.prisma.notDeleted() },
    });

    if (existing) {
      throw new ConflictException('Category name already exists');
    }

    if (createCategoryDto.code) {
      const existingCode = await this.prisma.category.findUnique({
        where: { code: createCategoryDto.code },
      });
      if (existingCode) {
        throw new ConflictException('Category code already exists');
      }
    }

    return this.prisma.category.create({ data: createCategoryDto });
  }

  /**
   * Updates an existing Categories record with the provided changes.
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existing = await this.prisma.category.findFirst({
        where: { name: updateCategoryDto.name, ...this.prisma.notDeleted() },
      });
      if (existing) {
        throw new ConflictException('Category name already exists');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  /**
   * Removes an existing Categories record while preserving business consistency.
   */
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.category.update({
      where: { id },
      data: this.prisma.softDelete(),
    });
    return { message: 'Category deleted successfully' };
  }
}
