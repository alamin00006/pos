import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class DamagesService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateDamageNo;
    create(dto: any): Promise<{
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
                costPrice: Decimal;
                sellPrice: Decimal;
                alertQuantity: number;
                categoryId: string | null;
                subcategoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            total: Decimal;
            productId: string;
            quantity: number;
            unitPrice: Decimal;
            damageId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
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
                    costPrice: Decimal;
                    sellPrice: Decimal;
                    alertQuantity: number;
                    categoryId: string | null;
                    subcategoryId: string | null;
                    brandId: string | null;
                    unitId: string | null;
                };
            } & {
                id: string;
                total: Decimal;
                productId: string;
                quantity: number;
                unitPrice: Decimal;
                damageId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            total: Decimal;
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
                costPrice: Decimal;
                sellPrice: Decimal;
                alertQuantity: number;
                categoryId: string | null;
                subcategoryId: string | null;
                brandId: string | null;
                unitId: string | null;
            };
        } & {
            id: string;
            total: Decimal;
            productId: string;
            quantity: number;
            unitPrice: Decimal;
            damageId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
        note: string | null;
        damageNo: string;
        damageDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
        note: string | null;
        damageNo: string;
        damageDate: Date;
    }>;
}
