import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class AssetsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        purchaseDate: Date;
        purchasePrice: Decimal;
        currentValue: Decimal;
        location: string | null;
        serialNumber: string | null;
    }>;
    findAll(query: PaginationDto): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            purchaseDate: Date;
            purchasePrice: Decimal;
            currentValue: Decimal;
            location: string | null;
            serialNumber: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        purchaseDate: Date;
        purchasePrice: Decimal;
        currentValue: Decimal;
        location: string | null;
        serialNumber: string | null;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        purchaseDate: Date;
        purchasePrice: Decimal;
        currentValue: Decimal;
        location: string | null;
        serialNumber: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        purchaseDate: Date;
        purchasePrice: Decimal;
        currentValue: Decimal;
        location: string | null;
        serialNumber: string | null;
    }>;
}
