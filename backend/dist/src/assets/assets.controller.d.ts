import { AssetsService } from './assets.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateAssetDto, UpdateAssetDto } from './dto';
export declare class AssetsController {
    private readonly service;
    constructor(service: AssetsService);
    create(dto: CreateAssetDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        purchaseDate: Date;
        purchasePrice: import("@prisma/client/runtime/library").Decimal;
        currentValue: import("@prisma/client/runtime/library").Decimal;
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
            purchasePrice: import("@prisma/client/runtime/library").Decimal;
            currentValue: import("@prisma/client/runtime/library").Decimal;
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
        purchasePrice: import("@prisma/client/runtime/library").Decimal;
        currentValue: import("@prisma/client/runtime/library").Decimal;
        location: string | null;
        serialNumber: string | null;
    }>;
    update(id: string, dto: UpdateAssetDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        purchaseDate: Date;
        purchasePrice: import("@prisma/client/runtime/library").Decimal;
        currentValue: import("@prisma/client/runtime/library").Decimal;
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
        purchasePrice: import("@prisma/client/runtime/library").Decimal;
        currentValue: import("@prisma/client/runtime/library").Decimal;
        location: string | null;
        serialNumber: string | null;
    }>;
}
