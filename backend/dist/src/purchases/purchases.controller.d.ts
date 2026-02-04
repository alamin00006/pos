import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto, UpdatePurchaseDto, PurchaseQueryDto, AddPurchasePaymentDto } from './dto';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(dto: CreatePurchaseDto, user: any): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        purchaseItems: ({
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
            purchaseId: string;
        })[];
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
    }>;
    findAll(query: PurchaseQueryDto): Promise<{
        data: ({
            user: {
                id: string;
                name: string;
            } | null;
            purchaseItems: ({
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
                purchaseId: string;
            })[];
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
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        purchaseItems: ({
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
            purchaseId: string;
        })[];
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
    }>;
    getReceipt(id: string): Promise<{
        receiptType: string;
        generatedAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        purchaseItems: ({
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
            purchaseId: string;
        })[];
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
    }>;
    update(id: string, dto: UpdatePurchaseDto): Promise<{
        purchaseItems: ({
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
            purchaseId: string;
        })[];
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
    }>;
    addPayment(id: string, dto: AddPurchasePaymentDto): Promise<{
        purchaseItems: ({
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
            purchaseId: string;
        })[];
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    getSupplierPurchases(supplierId: string, query: PurchaseQueryDto): Promise<{
        data: ({
            user: {
                id: string;
                name: string;
            } | null;
            purchaseItems: ({
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
                purchaseId: string;
            })[];
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
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
