import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto, UpdateSaleDto, SaleQueryDto, AddSalePaymentDto, RefundSaleDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: SaleQueryDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        profit: number;
        _count: {
            payments: number;
        };
        user: {
            id: string;
            name: string;
        } | null;
        saleItems: ({
            product: {
                id: string;
                name: string;
                productCode: string;
            };
        } & {
            id: string;
            total: Decimal;
            productId: string;
            quantity: number;
            unitPrice: Decimal;
            discount: Decimal;
            saleId: string;
        })[];
        customer: {
            id: string;
            name: string;
            phone: string | null;
        } | null;
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
    }>>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        saleItems: ({
            product: {
                id: string;
                name: string;
                productCode: string;
                barcode: string | null;
            };
        } & {
            id: string;
            total: Decimal;
            productId: string;
            quantity: number;
            unitPrice: Decimal;
            discount: Decimal;
            saleId: string;
        })[];
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            company: string | null;
            openingBalance: Decimal;
            createdById: string | null;
        } | null;
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            amount: Decimal;
            note: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentDate: Date;
            supplierId: string | null;
            customerId: string | null;
            purchaseId: string | null;
            saleId: string | null;
        }[];
    } & {
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
    }>;
    getReceipt(id: string): Promise<{
        sale: {
            user: {
                id: string;
                name: string;
                email: string;
            } | null;
            saleItems: ({
                product: {
                    id: string;
                    name: string;
                    productCode: string;
                    barcode: string | null;
                };
            } & {
                id: string;
                total: Decimal;
                productId: string;
                quantity: number;
                unitPrice: Decimal;
                discount: Decimal;
                saleId: string;
            })[];
            customer: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                email: string | null;
                phone: string | null;
                address: string | null;
                company: string | null;
                openingBalance: Decimal;
                createdById: string | null;
            } | null;
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                amount: Decimal;
                note: string | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentDate: Date;
                supplierId: string | null;
                customerId: string | null;
                purchaseId: string | null;
                saleId: string | null;
            }[];
        } & {
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
        company: {};
    }>;
    create(dto: CreateSaleDto, userId?: string): Promise<{
        saleItems: {
            id: string;
            total: Decimal;
            productId: string;
            quantity: number;
            unitPrice: Decimal;
            discount: Decimal;
            saleId: string;
        }[];
    } & {
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
    }>;
    update(id: string, dto: UpdateSaleDto): Promise<{
        saleItems: {
            id: string;
            total: Decimal;
            productId: string;
            quantity: number;
            unitPrice: Decimal;
            discount: Decimal;
            saleId: string;
        }[];
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            company: string | null;
            openingBalance: Decimal;
            createdById: string | null;
        } | null;
    } & {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addPayment(saleId: string, dto: AddSalePaymentDto): Promise<{
        message: string;
        newDueAmount: number;
        paymentStatus: "PARTIAL" | "PAID";
    }>;
    duplicate(id: string, userId?: string): Promise<{
        saleItems: {
            id: string;
            total: Decimal;
            productId: string;
            quantity: number;
            unitPrice: Decimal;
            discount: Decimal;
            saleId: string;
        }[];
    } & {
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
    }>;
    refund(saleId: string, dto: RefundSaleDto): Promise<{
        returnItems: {
            id: string;
            total: Decimal;
            productId: string;
            quantity: number;
            unitPrice: Decimal;
            returnId: string;
        }[];
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
    getTodaySales(): Promise<{
        count: number;
        totalSold: number;
        totalReceived: number;
        totalDue: number;
        sales: ({
            saleItems: ({
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
                discount: Decimal;
                saleId: string;
            })[];
            customer: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                email: string | null;
                phone: string | null;
                address: string | null;
                company: string | null;
                openingBalance: Decimal;
                createdById: string | null;
            } | null;
        } & {
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
        })[];
    }>;
    getSalesReport(query: SaleQueryDto): Promise<{
        summary: {
            totalSales: number;
            totalCost: number;
            totalProfit: number;
            totalDiscount: number;
            totalTax: number;
            totalPaid: number;
            totalDue: number;
            count: number;
        };
        sales: ({
            saleItems: ({
                product: {
                    costPrice: Decimal;
                };
            } & {
                id: string;
                total: Decimal;
                productId: string;
                quantity: number;
                unitPrice: Decimal;
                discount: Decimal;
                saleId: string;
            })[];
            customer: {
                name: string;
            } | null;
        } & {
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
        })[];
    }>;
    private getCustomerDue;
}
