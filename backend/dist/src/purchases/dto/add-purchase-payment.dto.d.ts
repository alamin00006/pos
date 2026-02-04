import { PaymentMethod } from '@prisma/client';
export declare class AddPurchasePaymentDto {
    amount: number;
    paymentMethod?: PaymentMethod;
    note?: string;
}
