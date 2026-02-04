import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class BankAccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: Decimal;
    }>;
    findAll(query: PaginationDto): Promise<{
        data: ({
            _count: {
                transactions: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            openingBalance: Decimal;
            bankName: string;
            accountName: string;
            accountNumber: string;
            branch: string | null;
            currentBalance: Decimal;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        transactions: {
            id: string;
            description: string | null;
            createdAt: Date;
            type: import(".prisma/client").$Enums.BankTransactionType;
            transactionDate: Date;
            amount: Decimal;
            balanceAfter: Decimal;
            referenceId: string | null;
            bankAccountId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: Decimal;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: Decimal;
    }>;
    deposit(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: Decimal;
    }>;
    withdraw(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: Decimal;
    }>;
    transfer(fromId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: Decimal;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: Decimal;
    }>;
}
