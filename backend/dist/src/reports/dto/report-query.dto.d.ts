export declare class DateRangeQueryDto {
    startDate?: string;
    endDate?: string;
}
export declare class TopItemsQueryDto extends DateRangeQueryDto {
    limit?: number;
}
export declare class CategoryReportQueryDto extends DateRangeQueryDto {
    categoryId?: string;
}
export declare class CustomerReportQueryDto extends DateRangeQueryDto {
    customerId?: string;
}
export declare class SupplierReportQueryDto extends DateRangeQueryDto {
    supplierId?: string;
}
