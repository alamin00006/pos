import { CreateSaleDto } from './create-sale.dto';
import { SaleStatus, PaymentStatus } from '@prisma/client';
declare const UpdateSaleDto_base: import("@nestjs/common").Type<Partial<Omit<CreateSaleDto, "items">>>;
export declare class UpdateSaleDto extends UpdateSaleDto_base {
    status?: SaleStatus;
    paymentStatus?: PaymentStatus;
}
export {};
