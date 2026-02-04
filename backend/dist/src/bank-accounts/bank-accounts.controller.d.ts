import { BankAccountsService } from './bank-accounts.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateBankAccountDto, UpdateBankAccountDto, DepositDto, WithdrawDto, TransferDto } from './dto';
export declare class BankAccountsController {
    private readonly service;
    constructor(service: BankAccountsService);
    create(dto: CreateBankAccountDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: import("@prisma/client/runtime/library").Decimal;
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
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            bankName: string;
            accountName: string;
            accountNumber: string;
            branch: string | null;
            currentBalance: import("@prisma/client/runtime/library").Decimal;
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
            amount: import("@prisma/client/runtime/library").Decimal;
            balanceAfter: import("@prisma/client/runtime/library").Decimal;
            referenceId: string | null;
            bankAccountId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, dto: UpdateBankAccountDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    deposit(id: string, dto: DepositDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    withdraw(id: string, dto: WithdrawDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    transfer(id: string, dto: TransferDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        bankName: string;
        accountName: string;
        accountNumber: string;
        branch: string | null;
        currentBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
}
