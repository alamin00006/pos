import { PaymentStatus, PurchaseStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class PurchaseQueryDto extends PaginationDto {
    supplierId?: string;
    status?: PurchaseStatus;
    paymentStatus?: PaymentStatus;
    startDate?: string;
    endDate?: string;
}
