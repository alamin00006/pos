import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { buildOrderByQuery, buildPaginationQuery, buildSearchQuery, paginate } from '../common/utils/pagination.util';
import { AssignUserBranchDto, CreateBranchDto, UpdateBranchDto } from './dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const where = { deletedAt: null, ...buildSearchQuery(search, ['name', 'code', 'phone']) };
    const prisma = this.prisma as any;
    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take,
        orderBy: buildOrderByQuery(sortBy, sortOrder, 'name'),
        include: { _count: { select: { userBranches: true, sales: true, purchases: true } } },
      }),
      prisma.branch.count({ where }),
    ]);

    return paginate(branches, total, page!, limit!);
  }

  async findOne(id: string) {
    const branch = await (this.prisma as any).branch.findFirst({
      where: { id, deletedAt: null },
      include: { userBranches: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async create(dto: CreateBranchDto) {
    const existing = await (this.prisma as any).branch.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Branch code already exists');
    return (this.prisma as any).branch.create({ data: { ...dto, isActive: dto.isActive ?? true } });
  }

  async update(id: string, dto: UpdateBranchDto) {
    await this.findOne(id);
    if (dto.code) {
      const existing = await (this.prisma as any).branch.findUnique({ where: { code: dto.code } });
      if (existing && existing.id !== id) throw new ConflictException('Branch code already exists');
    }
    return (this.prisma as any).branch.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const branch = await this.findOne(id);
    if (branch.code === 'MAIN') throw new BadRequestException('Default branch cannot be deleted');
    await (this.prisma as any).branch.update({ where: { id }, data: this.prisma.softDelete() });
    return { message: 'Branch deleted successfully' };
  }

  async assignUser(branchId: string, dto: AssignUserBranchDto) {
    await this.findOne(branchId);
    const user = await this.prisma.user.findFirst({ where: { id: dto.userId, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await (tx as any).userBranch.updateMany({ where: { userId: dto.userId }, data: { isDefault: false } });
      }
      return (tx as any).userBranch.upsert({
        where: { userId_branchId: { userId: dto.userId, branchId } },
        update: { isDefault: dto.isDefault ?? false },
        create: { userId: dto.userId, branchId, isDefault: dto.isDefault ?? false },
      });
    });
  }

  async removeUser(branchId: string, userId: string) {
    await (this.prisma as any).userBranch.deleteMany({ where: { branchId, userId } });
    return { message: 'User removed from branch successfully' };
  }
}
