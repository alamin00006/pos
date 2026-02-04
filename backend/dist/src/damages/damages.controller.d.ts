import { DamagesService } from './damages.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateDamageDto } from './dto';
export declare class DamagesController {
    private readonly service;
    constructor(service: DamagesService);
    create(dto: CreateDamageDto): Promise<{
        damageItems: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                image: string | null;
                productCode: string;
                barcode: string | null;
                costPrice: import("@prisma/client/runtime/library").Decimal;
                sellPrice: import("@prisma/client/runtime/library").Decimal;
                alertQuantity: number;
                categoryId: string | null;
                subcategoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            damageId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        damageNo: string;
        damageDate: Date;
    }>;
    findAll(query: PaginationDto): Promise<{
        data: ({
            damageItems: ({
                product: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    image: string | null;
                    productCode: string;
                    barcode: string | null;
                    costPrice: import("@prisma/client/runtime/library").Decimal;
                    sellPrice: import("@prisma/client/runtime/library").Decimal;
                    alertQuantity: number;
                    categoryId: string | null;
                    subcategoryId: string | null;
                    brandId: string | null;
                    unitId: string | null;
                };
            } & {
                id: string;
                total: import("@prisma/client/runtime/library").Decimal;
                productId: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                damageId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            damageNo: string;
            damageDate: Date;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        damageItems: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                image: string | null;
                productCode: string;
                barcode: string | null;
                costPrice: import("@prisma/client/runtime/library").Decimal;
                sellPrice: import("@prisma/client/runtime/library").Decimal;
                alertQuantity: number;
                categoryId: string | null;
                subcategoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            damageId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        damageNo: string;
        damageDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        damageNo: string;
        damageDate: Date;
    }>;
}
