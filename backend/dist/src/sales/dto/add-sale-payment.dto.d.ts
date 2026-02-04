import { PaymentMethod } from '@prisma/client';
export declare class AddSalePaymentDto {
    amount: number;
    paymentMethod?: PaymentMethod;
    note?: string;
    paymentDate?: string;
}
