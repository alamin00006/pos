import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        usersCount: number;
        permissionsCount: number;
        _count: undefined;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isSystem: boolean;
        deletedAt: Date | null;
    }>>;
    findOne(id: string): Promise<{
        permissions: {
            id: string;
            key: string;
            name: string;
            description: string | null;
            module: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        users: {
            id: string;
            name: string;
            email: string;
        }[];
        rolePermissions: undefined;
        userRoles: undefined;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isSystem: boolean;
        deletedAt: Date | null;
    }>;
    create(createRoleDto: CreateRoleDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isSystem: boolean;
        deletedAt: Date | null;
    }>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isSystem: boolean;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignPermissions(roleId: string, permissionIds: string[]): Promise<{
        message: string;
    }>;
    updatePermissions(roleId: string, permissionIds: string[]): Promise<{
        message: string;
    }>;
}
