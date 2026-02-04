import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class PermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        id: string;
        key: string;
        name: string;
        description: string | null;
        module: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findAllGrouped(): Promise<Record<string, {
        id: string;
        key: string;
        name: string;
        description: string | null;
        module: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>>;
    findByKey(key: string): Promise<{
        id: string;
        key: string;
        name: string;
        description: string | null;
        module: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
