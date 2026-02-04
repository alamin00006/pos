import { PaymentMethod } from '@prisma/client';
export declare class CustomerPaymentDto {
    amount: number;
    paymentMethod?: PaymentMethod;
    note?: string;
    paymentDate?: Date;
}
