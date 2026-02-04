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
exports.CashBookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let CashBookService = class CashBookService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 10, sortBy = 'entryDate', sortOrder = 'desc', startDate, endDate, type, source } = query;
        const where = {};
        if (type)
            where.type = type;
        if (source)
            where.source = source;
        if (startDate || endDate) {
            where.entryDate = {};
            if (startDate)
                where.entryDate.gte = new Date(startDate);
            if (endDate)
                where.entryDate.lte = new Date(endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.cashBook.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.cashBook.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async getBalance() {
        const lastEntry = await this.prisma.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
        return { balance: lastEntry?.balance || 0 };
    }
    async getSummary(query) {
        const where = {};
        if (query.startDate || query.endDate) {
            where.entryDate = {};
            if (query.startDate)
                where.entryDate.gte = new Date(query.startDate);
            if (query.endDate)
                where.entryDate.lte = new Date(query.endDate);
        }
        const [cashIn, cashOut] = await Promise.all([
            this.prisma.cashBook.aggregate({ where: { ...where, type: 'IN' }, _sum: { amount: true } }),
            this.prisma.cashBook.aggregate({ where: { ...where, type: 'OUT' }, _sum: { amount: true } }),
        ]);
        const totalIn = Number(cashIn._sum.amount || 0);
        const totalOut = Number(cashOut._sum.amount || 0);
        return {
            totalCashIn: totalIn,
            totalCashOut: totalOut,
            netCash: totalIn - totalOut,
        };
    }
};
exports.CashBookService = CashBookService;
exports.CashBookService = CashBookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CashBookService);
//# sourceMappingURL=cash-book.service.js.map