import { PaginationDto } from '../../common/dto/pagination.dto';
import { SaleStatus, PaymentStatus } from '@prisma/client';
export declare class SaleQueryDto extends PaginationDto {
    invoiceNo?: string;
    customerId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    status?: SaleStatus;
    paymentStatus?: PaymentStatus;
}
