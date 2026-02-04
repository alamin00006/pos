import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder, 'key');
    const searchQuery = buildSearchQuery(search, ['key', 'name', 'module']);

    const where = { ...searchQuery };

    const [permissions, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.permission.count({ where }),
    ]);

    return paginate(permissions, total, page!, limit!);
  }

  async findAllGrouped() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { key: 'asc' }],
    });

    // Group by module
    const grouped = permissions.reduce((acc, permission) => {
      const module = permission.module || 'Other';
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission);
      return acc;
    }, {} as Record<string, typeof permissions>);

    return grouped;
  }

  async findByKey(key: string) {
    return this.prisma.permission.findUnique({
      where: { key },
    });
  }
}
