import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';

@Injectable()
export class SubcategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ['name', 'code']);

    const where = {
      ...this.prisma.notDeleted(),
      ...searchQuery,
    };

    const [subcategories, total] = await Promise.all([
      this.prisma.subcategory.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: { select: { id: true, name: true } },
          _count: { select: { products: true } },
        },
      }),
      this.prisma.subcategory.count({ where }),
    ]);

    const formatted = subcategories.map((sub) => ({
      ...sub,
      productsCount: sub._count.products,
      _count: undefined,
    }));

    return paginate(formatted, total, page!, limit!);
  }

  async findByCategory(categoryId: string) {
    return this.prisma.subcategory.findMany({
      where: {
        categoryId,
        ...this.prisma.notDeleted(),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const subcategory = await this.prisma.subcategory.findFirst({
      where: { id, ...this.prisma.notDeleted() },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return subcategory;
  }

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    // Check if category exists
    const category = await this.prisma.category.findFirst({
      where: { id: createSubcategoryDto.categoryId, ...this.prisma.notDeleted() },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check for duplicate name within category
    const existing = await this.prisma.subcategory.findFirst({
      where: {
        name: createSubcategoryDto.name,
        categoryId: createSubcategoryDto.categoryId,
        ...this.prisma.notDeleted(),
      },
    });

    if (existing) {
      throw new ConflictException('Subcategory name already exists in this category');
    }

    return this.prisma.subcategory.create({
      data: createSubcategoryDto,
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    await this.findOne(id);

    return this.prisma.subcategory.update({
      where: { id },
      data: updateSubcategoryDto,
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.subcategory.update({
      where: { id },
      data: this.prisma.softDelete(),
    });
    return { message: 'Subcategory deleted successfully' };
  }
}
