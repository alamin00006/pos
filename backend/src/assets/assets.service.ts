import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Coordinates Assets business logic, validation, and persistence workflows.
 */
@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new Assets record after validating the request payload.
   */
  async create(dto: any) {
    return this.prisma.asset.create({
      data: {
        name: dto.name,
        description: dto.description,
        purchasePrice: new Decimal(dto.purchasePrice),
        currentValue: new Decimal(dto.currentValue || dto.purchasePrice),
        purchaseDate: new Date(dto.purchaseDate),
        location: dto.location,
        serialNumber: dto.serialNumber,
      },
    });
  }

  /**
   * Retrieves filtered Assets records for API consumers.
   */
  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = query;
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.asset.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  /**
   * Retrieves a single Assets record by identifier.
   */
  async findOne(id: string) {
    const asset = await this.prisma.asset.findFirst({ where: { id, deletedAt: null } });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  /**
   * Updates an existing Assets record with the provided changes.
   */
  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.asset.update({ where: { id }, data: dto });
  }

  /**
   * Removes an existing Assets record while preserving business consistency.
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.asset.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
