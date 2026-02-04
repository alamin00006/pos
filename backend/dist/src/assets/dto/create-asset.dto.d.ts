export declare class CreateAssetDto {
    name: string;
    assetCode?: string;
    category?: string;
    purchasePrice: number;
    purchaseDate?: string;
    currentValue?: number;
    depreciationYears?: number;
    depreciationMethod?: string;
    status?: string;
    location?: string;
    assignedTo?: string;
    serialNumber?: string;
    manufacturer?: string;
    model?: string;
    warrantyExpiry?: string;
    image?: string;
    notes?: string;
}
