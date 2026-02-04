export declare class CreateProductDto {
    name: string;
    productCode: string;
    barcode?: string;
    description?: string;
    costPrice: number;
    sellPrice: number;
    alertQuantity?: number;
    image?: string;
    categoryId?: string;
    subcategoryId?: string;
    brandId?: string;
    unitId?: string;
}
