import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ['name', 'shortName']);

    const where = {
      ...this.prisma.notDeleted(),
      ...searchQuery,
    };

    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({ where, skip, take, orderBy }),
      this.prisma.unit.count({ where }),
    ]);

    return paginate(units, total, page!, limit!);
  }

  async findOne(id: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id, ...this.prisma.notDeleted() },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return unit;
  }

  async create(createUnitDto: CreateUnitDto) {
    const existing = await this.prisma.unit.findFirst({
      where: { name: createUnitDto.name, ...this.prisma.notDeleted() },
    });

    if (existing) {
      throw new ConflictException('Unit name already exists');
    }

    return this.prisma.unit.create({ data: createUnitDto });
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    const unit = await this.findOne(id);

    if (updateUnitDto.name && updateUnitDto.name !== unit.name) {
      const existing = await this.prisma.unit.findFirst({
        where: { name: updateUnitDto.name, ...this.prisma.notDeleted() },
      });
      if (existing) {
        throw new ConflictException('Unit name already exists');
      }
    }

    return this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.unit.update({
      where: { id },
      data: this.prisma.softDelete(),
    });
    return { message: 'Unit deleted successfully' };
  }
}
