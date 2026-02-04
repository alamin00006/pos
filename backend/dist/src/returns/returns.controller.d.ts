import { ReturnsService } from './returns.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateReturnDto } from './dto';
export declare class ReturnsController {
    private readonly service;
    constructor(service: ReturnsService);
    create(dto: CreateReturnDto): Promise<{
        returnItems: ({
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
            returnId: string;
        })[];
        sale: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string | null;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            customerId: string | null;
            discount: import("@prisma/client/runtime/library").Decimal;
            tax: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.SaleStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            invoiceNo: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            dueAmount: import("@prisma/client/runtime/library").Decimal;
            discountType: string | null;
            saleDate: Date;
            changeAmount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        saleId: string;
        returnNo: string;
        returnDate: Date;
    }>;
    findAll(query: PaginationDto): Promise<{
        data: ({
            returnItems: ({
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
                returnId: string;
            })[];
            sale: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                userId: string | null;
                total: import("@prisma/client/runtime/library").Decimal;
                note: string | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                customerId: string | null;
                discount: import("@prisma/client/runtime/library").Decimal;
                tax: import("@prisma/client/runtime/library").Decimal;
                paidAmount: import("@prisma/client/runtime/library").Decimal;
                status: import(".prisma/client").$Enums.SaleStatus;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                invoiceNo: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                dueAmount: import("@prisma/client/runtime/library").Decimal;
                discountType: string | null;
                saleDate: Date;
                changeAmount: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            saleId: string;
            returnNo: string;
            returnDate: Date;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        returnItems: ({
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
            returnId: string;
        })[];
        sale: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string | null;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            customerId: string | null;
            discount: import("@prisma/client/runtime/library").Decimal;
            tax: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.SaleStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            invoiceNo: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            dueAmount: import("@prisma/client/runtime/library").Decimal;
            discountType: string | null;
            saleDate: Date;
            changeAmount: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        saleId: string;
        returnNo: string;
        returnDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        saleId: string;
        returnNo: string;
        returnDate: Date;
    }>;
}
