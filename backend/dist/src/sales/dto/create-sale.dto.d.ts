import { PaymentMethod } from '@prisma/client';
export declare class CreateSaleItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
}
export declare class CreateSalePaymentDto {
    amount: number;
    paymentMethod?: PaymentMethod;
    note?: string;
}
export declare class CreateSaleDto {
    customerId?: string;
    items: CreateSaleItemDto[];
    discount?: number;
    discountType?: string;
    tax?: number;
    payments?: CreateSalePaymentDto[];
    paymentMethod?: PaymentMethod;
    note?: string;
    saleDate?: string;
}
