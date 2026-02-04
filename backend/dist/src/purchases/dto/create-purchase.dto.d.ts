import { PaymentMethod } from '@prisma/client';
export declare class CreatePurchaseItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreatePurchaseDto {
    supplierId: string;
    items: CreatePurchaseItemDto[];
    discount?: number;
    tax?: number;
    shippingCost?: number;
    paidAmount?: number;
    paymentMethod?: PaymentMethod;
    note?: string;
}
