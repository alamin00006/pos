import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class ReturnsService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateReturnNo;
    create(dto: any): Promise<{
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
            returnId: string;
        })[];
        sale: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string | null;
            total: Decimal;
            note: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            customerId: string | null;
            discount: Decimal;
            tax: Decimal;
            paidAmount: Decimal;
            status: import(".prisma/client").$Enums.SaleStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            invoiceNo: string;
            subtotal: Decimal;
            dueAmount: Decimal;
            discountType: string | null;
            saleDate: Date;
            changeAmount: Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
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
                returnId: string;
            })[];
            sale: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                userId: string | null;
                total: Decimal;
                note: string | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                customerId: string | null;
                discount: Decimal;
                tax: Decimal;
                paidAmount: Decimal;
                status: import(".prisma/client").$Enums.SaleStatus;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                invoiceNo: string;
                subtotal: Decimal;
                dueAmount: Decimal;
                discountType: string | null;
                saleDate: Date;
                changeAmount: Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            total: Decimal;
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
            returnId: string;
        })[];
        sale: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string | null;
            total: Decimal;
            note: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            customerId: string | null;
            discount: Decimal;
            tax: Decimal;
            paidAmount: Decimal;
            status: import(".prisma/client").$Enums.SaleStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            invoiceNo: string;
            subtotal: Decimal;
            dueAmount: Decimal;
            discountType: string | null;
            saleDate: Date;
            changeAmount: Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
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
        total: Decimal;
        note: string | null;
        saleId: string;
        returnNo: string;
        returnDate: Date;
    }>;
}
