import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';

/**
 * Coordinates Brands business logic, validation, and persistence workflows.
 */
@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves filtered Brands records for API consumers.
   */
  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ['name']);

    const where = {
      ...this.prisma.notDeleted(),
      ...searchQuery,
    };

    const [brands, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          _count: { select: { products: true } },
        },
      }),
      this.prisma.brand.count({ where }),
    ]);

    const formattedBrands = brands.map((brand) => ({
      ...brand,
      productsCount: brand._count.products,
      _count: undefined,
    }));

    return paginate(formattedBrands, total, page!, limit!);
  }

  /**
   * Retrieves a single Brands record by identifier.
   */
  async findOne(id: string) {
    const brand = await this.prisma.brand.findFirst({
      where: { id, ...this.prisma.notDeleted() },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return {
      ...brand,
      productsCount: brand._count.products,
      _count: undefined,
    };
  }

  /**
   * Creates a new Brands record after validating the request payload.
   */
  async create(createBrandDto: CreateBrandDto) {
    const existing = await this.prisma.brand.findFirst({
      where: { name: createBrandDto.name, ...this.prisma.notDeleted() },
    });

    if (existing) {
      throw new ConflictException('Brand name already exists');
    }

    return this.prisma.brand.create({ data: createBrandDto });
  }

  /**
   * Updates an existing Brands record with the provided changes.
   */
  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);

    if (updateBrandDto.name && updateBrandDto.name !== brand.name) {
      const existing = await this.prisma.brand.findFirst({
        where: { name: updateBrandDto.name, ...this.prisma.notDeleted() },
      });
      if (existing) {
        throw new ConflictException('Brand name already exists');
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  /**
   * Removes an existing Brands record while preserving business consistency.
   */
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.brand.update({
      where: { id },
      data: this.prisma.softDelete(),
    });
    return { message: 'Brand deleted successfully' };
  }
}
