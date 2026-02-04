import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id, deletedAt: null } });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.asset.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.asset.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
