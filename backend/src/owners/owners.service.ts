import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ['name', 'email', 'phone']);

    const where = {
      ...this.prisma.notDeleted(),
      ...searchQuery,
    };

    const [owners, total] = await Promise.all([
      this.prisma.owner.findMany({ where, skip, take, orderBy }),
      this.prisma.owner.count({ where }),
    ]);

    return paginate(owners, total, page!, limit!);
  }

  async findOne(id: string) {
    const owner = await this.prisma.owner.findFirst({
      where: { id, ...this.prisma.notDeleted() },
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    return owner;
  }

  async create(createOwnerDto: CreateOwnerDto) {
    return this.prisma.owner.create({ data: createOwnerDto });
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto) {
    await this.findOne(id);
    return this.prisma.owner.update({
      where: { id },
      data: updateOwnerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.owner.update({
      where: { id },
      data: this.prisma.softDelete(),
    });
    return { message: 'Owner deleted successfully' };
  }
}
