import { CashBookService } from './cash-book.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CashBookController {
    private readonly service;
    constructor(service: CashBookService);
    findAll(query: PaginationDto): Promise<{
        data: {
            id: string;
            description: string | null;
            createdAt: Date;
            type: import(".prisma/client").$Enums.CashBookType;
            amount: import("@prisma/client/runtime/library").Decimal;
            referenceId: string | null;
            source: import(".prisma/client").$Enums.CashBookSource;
            balance: import("@prisma/client/runtime/library").Decimal;
            entryDate: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getBalance(): Promise<{
        balance: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getSummary(query: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        totalCashIn: number;
        totalCashOut: number;
        netCash: number;
    }>;
}
