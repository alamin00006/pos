export declare class EstimateItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
}
export declare class CreateEstimateDto {
    customerId: string;
    date?: string;
    validUntil?: string;
    items: EstimateItemDto[];
    discount?: number;
    discountType?: string;
    taxRate?: number;
    shippingCost?: number;
    status?: string;
    notes?: string;
    terms?: string;
}
