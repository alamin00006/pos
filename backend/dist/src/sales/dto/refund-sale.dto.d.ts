export declare class RefundItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class RefundSaleDto {
    items: RefundItemDto[];
    note?: string;
}
