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
exports.BankAccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let BankAccountsService = class BankAccountsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.bankAccount.create({
            data: {
                bankName: dto.bankName,
                accountName: dto.accountName,
                accountNumber: dto.accountNumber,
                branch: dto.branch,
                openingBalance: new library_1.Decimal(dto.openingBalance || 0),
                currentBalance: new library_1.Decimal(dto.openingBalance || 0),
            },
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { bankName: { contains: search, mode: 'insensitive' } },
                { accountName: { contains: search, mode: 'insensitive' } },
                { accountNumber: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.bankAccount.findMany({
                where,
                include: { _count: { select: { transactions: true } } },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.bankAccount.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const account = await this.prisma.bankAccount.findUnique({
            where: { id, deletedAt: null },
            include: { transactions: { orderBy: { transactionDate: 'desc' }, take: 50 } },
        });
        if (!account)
            throw new common_1.NotFoundException('Bank account not found');
        return account;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.bankAccount.update({
            where: { id },
            data: dto,
        });
    }
    async deposit(id, dto) {
        const account = await this.findOne(id);
        const newBalance = Number(account.currentBalance) + dto.amount;
        return this.prisma.$transaction(async (tx) => {
            await tx.bankTransaction.create({
                data: {
                    bankAccountId: id,
                    type: client_1.BankTransactionType.DEPOSIT,
                    amount: new library_1.Decimal(dto.amount),
                    balanceAfter: new library_1.Decimal(newBalance),
                    description: dto.description,
                },
            });
            return tx.bankAccount.update({
                where: { id },
                data: { currentBalance: new library_1.Decimal(newBalance) },
            });
        });
    }
    async withdraw(id, dto) {
        const account = await this.findOne(id);
        if (Number(account.currentBalance) < dto.amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const newBalance = Number(account.currentBalance) - dto.amount;
        return this.prisma.$transaction(async (tx) => {
            await tx.bankTransaction.create({
                data: {
                    bankAccountId: id,
                    type: client_1.BankTransactionType.WITHDRAW,
                    amount: new library_1.Decimal(dto.amount),
                    balanceAfter: new library_1.Decimal(newBalance),
                    description: dto.description,
                },
            });
            return tx.bankAccount.update({
                where: { id },
                data: { currentBalance: new library_1.Decimal(newBalance) },
            });
        });
    }
    async transfer(fromId, dto) {
        const fromAccount = await this.findOne(fromId);
        const toAccount = await this.findOne(dto.toAccountId);
        if (Number(fromAccount.currentBalance) < dto.amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const fromNewBalance = Number(fromAccount.currentBalance) - dto.amount;
        const toNewBalance = Number(toAccount.currentBalance) + dto.amount;
        return this.prisma.$transaction(async (tx) => {
            await tx.bankTransaction.create({
                data: {
                    bankAccountId: fromId,
                    type: client_1.BankTransactionType.TRANSFER_OUT,
                    amount: new library_1.Decimal(dto.amount),
                    balanceAfter: new library_1.Decimal(fromNewBalance),
                    referenceId: dto.toAccountId,
                    description: `Transfer to ${toAccount.accountName}`,
                },
            });
            await tx.bankTransaction.create({
                data: {
                    bankAccountId: dto.toAccountId,
                    type: client_1.BankTransactionType.TRANSFER_IN,
                    amount: new library_1.Decimal(dto.amount),
                    balanceAfter: new library_1.Decimal(toNewBalance),
                    referenceId: fromId,
                    description: `Transfer from ${fromAccount.accountName}`,
                },
            });
            await tx.bankAccount.update({
                where: { id: fromId },
                data: { currentBalance: new library_1.Decimal(fromNewBalance) },
            });
            return tx.bankAccount.update({
                where: { id: dto.toAccountId },
                data: { currentBalance: new library_1.Decimal(toNewBalance) },
            });
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.bankAccount.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.BankAccountsService = BankAccountsService;
exports.BankAccountsService = BankAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BankAccountsService);
//# sourceMappingURL=bank-accounts.service.js.map