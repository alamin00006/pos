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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let RolesService = class RolesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder);
        const searchQuery = (0, pagination_util_1.buildSearchQuery)(search, ['name']);
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
        return (0, pagination_util_1.paginate)(formattedRoles, total, page, limit);
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException('Role not found');
        }
        return {
            ...role,
            permissions: role.rolePermissions.map((rp) => rp.permission),
            users: role.userRoles.map((ur) => ur.user),
            rolePermissions: undefined,
            userRoles: undefined,
        };
    }
    async create(createRoleDto) {
        const existingRole = await this.prisma.role.findUnique({
            where: { name: createRoleDto.name },
        });
        if (existingRole) {
            throw new common_1.ConflictException('Role name already exists');
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
    async update(id, updateRoleDto) {
        const role = await this.prisma.role.findFirst({
            where: { id, ...this.prisma.notDeleted() },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role.isSystem) {
            throw new common_1.BadRequestException('Cannot modify system role');
        }
        if (updateRoleDto.name && updateRoleDto.name !== role.name) {
            const existingRole = await this.prisma.role.findUnique({
                where: { name: updateRoleDto.name },
            });
            if (existingRole) {
                throw new common_1.ConflictException('Role name already exists');
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
    async remove(id) {
        const role = await this.prisma.role.findFirst({
            where: { id, ...this.prisma.notDeleted() },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role.isSystem) {
            throw new common_1.BadRequestException('Cannot delete system role');
        }
        await this.prisma.role.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'Role deleted successfully' };
    }
    async assignPermissions(roleId, permissionIds) {
        const role = await this.prisma.role.findFirst({
            where: { id: roleId, ...this.prisma.notDeleted() },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        await this.prisma.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            })),
            skipDuplicates: true,
        });
        return { message: 'Permissions assigned successfully' };
    }
    async updatePermissions(roleId, permissionIds) {
        const role = await this.prisma.role.findFirst({
            where: { id: roleId, ...this.prisma.notDeleted() },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
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
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map