export declare class ReturnItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    reason?: string;
}
export declare class CreateReturnDto {
    saleId: string;
    customerId?: string;
    items: ReturnItemDto[];
    returnType?: string;
    reason?: string;
    notes?: string;
}
