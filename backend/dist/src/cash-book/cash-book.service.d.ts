import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CashBookService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto & {
        startDate?: string;
        endDate?: string;
        type?: string;
        source?: string;
    }): Promise<{
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
