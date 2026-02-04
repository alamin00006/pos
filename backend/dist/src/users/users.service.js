"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder);
        const searchQuery = (0, pagination_util_1.buildSearchQuery)(search, ['name', 'email']);
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
        return (0, pagination_util_1.paginate)(formattedUsers, total, page, limit);
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return {
            ...user,
            roles: user.userRoles.map((ur) => ur.role),
            permissions: [
                ...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.key))),
            ],
            userRoles: undefined,
        };
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async create(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
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
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findFirst({
            where: { id, ...this.prisma.notDeleted() },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        const data = { ...updateUserDto };
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
    async remove(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, ...this.prisma.notDeleted() },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'User deleted successfully' };
    }
    async assignRole(userId, roleId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, ...this.prisma.notDeleted() },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const role = await this.prisma.role.findFirst({
            where: { id: roleId, ...this.prisma.notDeleted() },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
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
    async removeRole(userId, roleId) {
        await this.prisma.userRole.deleteMany({
            where: { userId, roleId },
        });
        return { message: 'Role removed successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map