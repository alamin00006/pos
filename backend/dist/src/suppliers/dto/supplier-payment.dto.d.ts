import { PaymentMethod } from '@prisma/client';
export declare class SupplierPaymentDto {
    amount: number;
    paymentMethod?: PaymentMethod;
    note?: string;
    paymentDate?: Date;
}
