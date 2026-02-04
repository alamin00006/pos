import { PurchaseStatus } from '@prisma/client';
export declare class UpdatePurchaseDto {
    discount?: number;
    tax?: number;
    shippingCost?: number;
    status?: PurchaseStatus;
    note?: string;
}
