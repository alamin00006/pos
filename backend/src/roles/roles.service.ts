import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ['name']);

    const where = {
      ...this.prisma.notDeleted(),
      ...searchQuery,
    };

    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          _count: {
            select: {
              userRoles: true,
              rolePermissions: true,
            },
          },
        },
      }),
      this.prisma.role.count({ where }),
    ]);

    const formattedRoles = roles.map((role) => ({
      ...role,
      usersCount: role._count.userRoles,
      permissionsCount: role._count.rolePermissions,
      _count: undefined,
    }));

    return paginate(formattedRoles, total, page!, limit!);
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findFirst({
      where: { id, ...this.prisma.notDeleted() },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        userRoles: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      ...role,
      permissions: role.rolePermissions.map((rp) => rp.permission),
      users: role.userRoles.map((ur) => ur.user),
      rolePermissions: undefined,
      userRoles: undefined,
    };
  }

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        rolePermissions: createRoleDto.permissionIds
          ? {
              create: createRoleDto.permissionIds.map((permissionId) => ({
                permissionId,
              })),
            }
          : undefined,
      },
    });

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findFirst({
      where: { id, ...this.prisma.notDeleted() },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new BadRequestException('Cannot modify system role');
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name },
      });
      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: {
        name: updateRoleDto.name,
        description: updateRoleDto.description,
      },
    });

    return updatedRole;
  }

  async remove(id: string) {
    const role = await this.prisma.role.findFirst({
      where: { id, ...this.prisma.notDeleted() },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new BadRequestException('Cannot delete system role');
    }

    await this.prisma.role.update({
      where: { id },
      data: this.prisma.softDelete(),
    });

    return { message: 'Role deleted successfully' };
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, ...this.prisma.notDeleted() },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Create new permission assignments (ignore duplicates)
    await this.prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
      skipDuplicates: true,
    });

    return { message: 'Permissions assigned successfully' };
  }

  async updatePermissions(roleId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, ...this.prisma.notDeleted() },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Replace all permissions
    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({
        where: { roleId },
      }),
      this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      }),
    ]);

    return { message: 'Permissions updated successfully' };
  }
}
