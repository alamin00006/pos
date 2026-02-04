import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto, SaleQueryDto, AddSalePaymentDto, RefundSaleDto } from './dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
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
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
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
    }>>;
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
                discount: import("@prisma/client/runtime/library").Decimal;
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
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                createdById: string | null;
            } | null;
        } & {
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
                    costPrice: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: string;
                total: import("@prisma/client/runtime/library").Decimal;
                productId: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                discount: import("@prisma/client/runtime/library").Decimal;
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
        })[];
    }>;
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
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
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
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            createdById: string | null;
        } | null;
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            amount: import("@prisma/client/runtime/library").Decimal;
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
                total: import("@prisma/client/runtime/library").Decimal;
                productId: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                discount: import("@prisma/client/runtime/library").Decimal;
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
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                createdById: string | null;
            } | null;
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                amount: import("@prisma/client/runtime/library").Decimal;
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
        company: {};
    }>;
    create(dto: CreateSaleDto, userId: string): Promise<{
        saleItems: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            saleId: string;
        }[];
    } & {
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
    }>;
    update(id: string, dto: UpdateSaleDto): Promise<{
        saleItems: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
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
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            createdById: string | null;
        } | null;
    } & {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addPayment(id: string, dto: AddSalePaymentDto): Promise<{
        message: string;
        newDueAmount: number;
        paymentStatus: "PARTIAL" | "PAID";
    }>;
    duplicate(id: string, userId: string): Promise<{
        saleItems: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            saleId: string;
        }[];
    } & {
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
    }>;
    refund(id: string, dto: RefundSaleDto): Promise<{
        returnItems: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            returnId: string;
        }[];
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
}
