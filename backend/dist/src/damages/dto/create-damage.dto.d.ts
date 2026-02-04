export declare class DamageItemDto {
    productId: string;
    quantity: number;
    unitCost?: number;
    reason?: string;
}
export declare class CreateDamageDto {
    date?: string;
    items: DamageItemDto[];
    reason?: string;
    notes?: string;
    attachment?: string;
}
