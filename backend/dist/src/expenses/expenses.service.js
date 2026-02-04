"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let ExpensesService = class ExpensesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    expenseCategoryId: dto.expenseCategoryId,
                    bankAccountId: dto.bankAccountId,
                    amount: new library_1.Decimal(dto.amount),
                    paymentMethod: dto.paymentMethod,
                    description: dto.description,
                    reference: dto.reference,
                    expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date(),
                },
                include: { expenseCategory: true, bankAccount: true },
            });
            const lastCashBook = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
            const cashBalance = lastCashBook?.balance || new library_1.Decimal(0);
            await tx.cashBook.create({
                data: {
                    type: client_1.CashBookType.OUT,
                    source: client_1.CashBookSource.EXPENSE,
                    referenceId: expense.id,
                    amount: new library_1.Decimal(dto.amount),
                    balance: new library_1.Decimal(Number(cashBalance) - dto.amount),
                    description: dto.description || 'Expense',
                },
            });
            return expense;
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', expenseCategoryId, startDate, endDate } = query;
        const where = { deletedAt: null };
        if (search)
            where.description = { contains: search, mode: 'insensitive' };
        if (expenseCategoryId)
            where.expenseCategoryId = expenseCategoryId;
        if (startDate || endDate) {
            where.expenseDate = {};
            if (startDate)
                where.expenseDate.gte = new Date(startDate);
            if (endDate)
                where.expenseDate.lte = new Date(endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.expense.findMany({
                where,
                include: { expenseCategory: true, bankAccount: true },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.expense.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const expense = await this.prisma.expense.findUnique({
            where: { id, deletedAt: null },
            include: { expenseCategory: true, bankAccount: true },
        });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        return expense;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.expense.update({
            where: { id },
            data: dto,
            include: { expenseCategory: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.expense.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map