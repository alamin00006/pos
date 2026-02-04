import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ['name', 'email']);

    const where = {
      ...this.prisma.notDeleted(),
      ...searchQuery,
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const formattedUsers = users.map((user) => ({
      ...user,
      roles: user.userRoles.map((ur) => ur.role.name),
      userRoles: undefined,
    }));

    return paginate(formattedUsers, total, page!, limit!);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, ...this.prisma.notDeleted() },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      roles: user.userRoles.map((ur) => ur.role),
      permissions: [
        ...new Set(
          user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.key),
          ),
        ),
      ],
      userRoles: undefined,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        userRoles: createUserDto.roleIds
          ? {
              create: createUserDto.roleIds.map((roleId) => ({
                roleId,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id, ...this.prisma.notDeleted() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    const data: any = { ...updateUserDto };
    
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    delete data.roleIds;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, ...this.prisma.notDeleted() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: this.prisma.softDelete(),
    });

    return { message: 'User deleted successfully' };
  }

  async assignRole(userId: string, roleId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, ...this.prisma.notDeleted() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.prisma.role.findFirst({
      where: { id: roleId, ...this.prisma.notDeleted() },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.prisma.userRole.upsert({
      where: {
        userId_roleId: { userId, roleId },
      },
      update: {},
      create: { userId, roleId },
    });

    return { message: 'Role assigned successfully' };
  }

  async removeRole(userId: string, roleId: string) {
    await this.prisma.userRole.deleteMany({
      where: { userId, roleId },
    });

    return { message: 'Role removed successfully' };
  }
}
