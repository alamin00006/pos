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
exports.SalaryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let SalaryService = class SalaryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const employee = await this.prisma.employee.findUnique({ where: { id: dto.employeeId, deletedAt: null } });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        const existing = await this.prisma.salaryPayment.findUnique({
            where: { employeeId_month_year: { employeeId: dto.employeeId, month: dto.month, year: dto.year } },
        });
        if (existing)
            throw new common_1.BadRequestException('Salary already paid for this month');
        const basicSalary = dto.basicSalary || Number(employee.basicSalary);
        const netSalary = basicSalary + (dto.overtime || 0) + (dto.bonus || 0) - (dto.deduction || 0);
        return this.prisma.$transaction(async (tx) => {
            const salary = await tx.salaryPayment.create({
                data: {
                    employeeId: dto.employeeId,
                    basicSalary: new library_1.Decimal(basicSalary),
                    overtime: new library_1.Decimal(dto.overtime || 0),
                    bonus: new library_1.Decimal(dto.bonus || 0),
                    deduction: new library_1.Decimal(dto.deduction || 0),
                    netSalary: new library_1.Decimal(netSalary),
                    paymentMethod: dto.paymentMethod,
                    month: dto.month,
                    year: dto.year,
                    note: dto.note,
                },
                include: { employee: true },
            });
            const lastCashBook = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
            const cashBalance = lastCashBook?.balance || new library_1.Decimal(0);
            await tx.cashBook.create({
                data: {
                    type: client_1.CashBookType.OUT,
                    source: client_1.CashBookSource.OTHER,
                    referenceId: salary.id,
                    amount: new library_1.Decimal(netSalary),
                    balance: new library_1.Decimal(Number(cashBalance) - netSalary),
                    description: `Salary payment - ${employee.name} (${dto.month}/${dto.year})`,
                },
            });
            return salary;
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, sortBy = 'paymentDate', sortOrder = 'desc', employeeId, month, year } = query;
        const where = {};
        if (employeeId)
            where.employeeId = employeeId;
        if (month)
            where.month = month;
        if (year)
            where.year = year;
        const [data, total] = await Promise.all([
            this.prisma.salaryPayment.findMany({
                where,
                include: { employee: true },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.salaryPayment.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const salary = await this.prisma.salaryPayment.findUnique({
            where: { id },
            include: { employee: true },
        });
        if (!salary)
            throw new common_1.NotFoundException('Salary payment not found');
        return salary;
    }
};
exports.SalaryService = SalaryService;
exports.SalaryService = SalaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalaryService);
//# sourceMappingURL=salary.service.js.map