import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        roles: string[];
        userRoles: undefined;
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
    }>>;
    findOne(id: string): Promise<{
        roles: ({
            rolePermissions: ({
                permission: {
                    id: string;
                    key: string;
                    name: string;
                    description: string | null;
                    module: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                roleId: string;
                permissionId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isSystem: boolean;
            deletedAt: Date | null;
        })[];
        permissions: string[];
        userRoles: undefined;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        email: string;
        password: string;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
        refreshToken: string | null;
    } | null>;
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string | null;
        isActive: boolean;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        email: string;
        phone: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignRole(userId: string, roleId: string): Promise<{
        message: string;
    }>;
    removeRole(userId: string, roleId: string): Promise<{
        message: string;
    }>;
}
