import { ExpensesService } from './expenses.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
export declare class ExpensesController {
    private readonly service;
    constructor(service: ExpensesService);
    create(dto: CreateExpenseDto): Promise<{
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
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            bankName: string;
            accountName: string;
            accountNumber: string;
            branch: string | null;
            currentBalance: import("@prisma/client/runtime/library").Decimal;
        } | null;
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        bankAccountId: string | null;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        expenseCategoryId: string;
    }>;
    findAll(query: PaginationDto): Promise<{
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
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                bankName: string;
                accountName: string;
                accountNumber: string;
                branch: string | null;
                currentBalance: import("@prisma/client/runtime/library").Decimal;
            } | null;
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            amount: import("@prisma/client/runtime/library").Decimal;
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
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            bankName: string;
            accountName: string;
            accountNumber: string;
            branch: string | null;
            currentBalance: import("@prisma/client/runtime/library").Decimal;
        } | null;
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        bankAccountId: string | null;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        expenseCategoryId: string;
    }>;
    update(id: string, dto: UpdateExpenseDto): Promise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
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
        amount: import("@prisma/client/runtime/library").Decimal;
        bankAccountId: string | null;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        expenseDate: Date;
        expenseCategoryId: string;
    }>;
}
