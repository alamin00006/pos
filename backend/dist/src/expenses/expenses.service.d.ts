import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        expenseCategory: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        bankAccount: {
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
        } | null;
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        amount: Decimal;
        bankAccountId: string | null;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        expenseCategoryId: string;
    }>;
    findAll(query: PaginationDto & {
        expenseCategoryId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        data: ({
            expenseCategory: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
            bankAccount: {
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
            } | null;
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            amount: Decimal;
            bankAccountId: string | null;
            reference: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            expenseDate: Date;
            expenseCategoryId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        expenseCategory: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        bankAccount: {
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
        } | null;
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        amount: Decimal;
        bankAccountId: string | null;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        expenseCategoryId: string;
    }>;
    update(id: string, dto: any): Promise<{
        expenseCategory: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        amount: Decimal;
        bankAccountId: string | null;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        expenseCategoryId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        amount: Decimal;
        bankAccountId: string | null;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        expenseCategoryId: string;
    }>;
}
