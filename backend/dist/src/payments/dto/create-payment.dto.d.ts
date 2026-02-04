export declare class CreatePaymentDto {
    amount: number;
    paymentFor: string;
    customerId?: string;
    supplierId?: string;
    saleId?: string;
    purchaseId?: string;
    paymentMethod: string;
    bankAccountId?: string;
    date?: string;
    reference?: string;
    notes?: string;
}
