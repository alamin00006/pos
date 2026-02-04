import { ReportsService } from './reports.service';
import { DateRangeQueryDto, TopItemsQueryDto, CategoryReportQueryDto, CustomerReportQueryDto, SupplierReportQueryDto } from './dto/report-query.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getTodayReport(): Promise<{
        date: string;
        sales: {
            total: number;
            received: number;
            due: number;
            count: number;
        };
        purchases: {
            total: number;
            paid: number;
            count: number;
        };
        expenses: {
            total: number;
            count: number;
        };
        returns: {
            total: number;
            count: number;
        };
        profit: number;
    }>;
    getDailyReport(query: DateRangeQueryDto): Promise<{
        summary: {
            totalSales: number;
            totalPurchases: number;
            totalExpenses: number;
            profit: number;
            salesCount: number;
            purchasesCount: number;
            expensesCount: number;
        };
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
        purchases: ({
            supplier: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string | null;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            supplierId: string;
            discount: import("@prisma/client/runtime/library").Decimal;
            tax: import("@prisma/client/runtime/library").Decimal;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.PurchaseStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            invoiceNo: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            dueAmount: import("@prisma/client/runtime/library").Decimal;
            purchaseDate: Date;
        })[];
        expenses: ({
            expenseCategory: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            bankAccountId: string | null;
            reference: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            expenseDate: Date;
            expenseCategoryId: string;
        })[];
    }>;
    getCurrentMonthReport(): Promise<{
        month: string;
        sales: {
            total: number;
            received: number;
            due: number;
            discount: number;
            count: number;
        };
        purchases: {
            total: number;
            paid: number;
            due: number;
            count: number;
        };
        expenses: {
            total: number;
            count: number;
        };
        returns: {
            total: number;
            count: number;
        };
        damages: {
            total: number;
            count: number;
        };
        profit: number;
    }>;
    getProfitLossReport(query: DateRangeQueryDto): Promise<{
        period: {
            startDate: string | undefined;
            endDate: string | undefined;
        };
        revenue: {
            totalSales: number;
            discountsGiven: number;
            netRevenue: number;
        };
        costs: {
            costOfGoodsSold: number;
            expenses: number;
            returns: number;
            damages: number;
            totalCosts: number;
        };
        profit: {
            grossProfit: number;
            netProfit: number;
            profitMargin: string;
        };
    }>;
    getTopProductsReport(query: TopItemsQueryDto): Promise<{
        rank: number;
        product: ({
            brand: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                image: string | null;
            } | null;
            category: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                image: string | null;
                code: string | null;
            } | null;
        } & {
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
        }) | undefined;
        quantitySold: number | null;
        totalRevenue: number;
        salesCount: number;
    }[]>;
    getTopCustomersReport(query: TopItemsQueryDto): Promise<{
        rank: number;
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
        } | undefined;
        totalPurchases: number;
        totalPaid: number;
        totalDue: number;
        ordersCount: number;
    }[]>;
    getCategoryWiseReport(query: CategoryReportQueryDto): Promise<{
        category: {
            id: string;
            name: string;
        };
        salesData: {
            quantity: number;
            revenue: number;
            count: number;
        };
        purchaseData: {
            quantity: number;
            cost: number;
            count: number;
        };
    }[]>;
    getSalesReport(query: DateRangeQueryDto): Promise<{
        summary: {
            totalSales: number;
            totalReceived: number;
            totalDue: number;
            totalDiscount: number;
            averageOrderValue: number;
            salesCount: number;
        };
        dailyBreakdown: any[];
    }>;
    getPurchaseReport(query: DateRangeQueryDto): Promise<{
        summary: {
            totalPurchases: number;
            totalPaid: number;
            totalDue: number;
            averageOrderValue: number;
            purchasesCount: number;
        };
        bySupplier: {
            supplier: {
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
            } | undefined;
            totalPurchases: number;
            count: number;
        }[];
    }>;
    getCustomerDueReport(query: CustomerReportQueryDto): Promise<{
        customer: {
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
        };
        totalDue: number;
        pendingInvoices: number;
        invoices: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            invoiceNo: string;
            dueAmount: import("@prisma/client/runtime/library").Decimal;
            saleDate: Date;
        }[];
    }[]>;
    getSupplierDueReport(query: SupplierReportQueryDto): Promise<{
        supplier: {
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
        };
        totalDue: number;
        pendingInvoices: number;
        invoices: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            invoiceNo: string;
            dueAmount: import("@prisma/client/runtime/library").Decimal;
            purchaseDate: Date;
        }[];
    }[]>;
    getLowStockReport(): Promise<{
        product: {
            id: string;
            name: string;
            productCode: string;
            barcode: string | null;
            category: string | undefined;
            brand: string | undefined;
            unit: string | undefined;
        };
        currentStock: number;
        alertQuantity: number;
        isLowStock: boolean;
    }[]>;
    getSummaryReport(): Promise<{
        entities: {
            customers: number;
            suppliers: number;
            products: number;
        };
        sales: {
            total: number;
            received: number;
            due: number;
            count: number;
        };
        purchases: {
            total: number;
            paid: number;
            due: number;
            count: number;
        };
        expenses: {
            total: number;
            count: number;
        };
        returns: {
            total: number;
            count: number;
        };
        financial: {
            totalRevenue: number;
            totalCost: number;
            totalProfit: number;
        };
    }>;
}
