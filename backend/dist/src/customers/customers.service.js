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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
let CustomersService = class CustomersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const where = { ...this.prisma.notDeleted(), ...(0, pagination_util_1.buildSearchQuery)(search, ['name', 'email', 'phone']) };
        const [customers, total] = await Promise.all([
            this.prisma.customer.findMany({ where, skip, take, orderBy: (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder) }),
            this.prisma.customer.count({ where }),
        ]);
        const customersWithDue = await Promise.all(customers.map(async (c) => ({ ...c, due: await this.calculateDue(c.id) })));
        return (0, pagination_util_1.paginate)(customersWithDue, total, page, limit);
    }
    async getDueReport(query) {
        const { page, limit } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const customers = await this.prisma.customer.findMany({ where: this.prisma.notDeleted() });
        const customersWithDue = (await Promise.all(customers.map(async (c) => ({ ...c, due: await this.calculateDue(c.id) })))).filter((c) => c.due > 0);
        return (0, pagination_util_1.paginate)(customersWithDue.slice(skip, skip + take), customersWithDue.length, page, limit);
    }
    async findOne(id) {
        const customer = await this.prisma.customer.findFirst({ where: { id, ...this.prisma.notDeleted() } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return { ...customer, due: await this.calculateDue(id) };
    }
    async getLedger(id, query) {
        const { page, limit } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        await this.findOne(id);
        const [ledger, total] = await Promise.all([
            this.prisma.customerLedger.findMany({ where: { customerId: id }, skip, take, orderBy: { createdAt: 'desc' } }),
            this.prisma.customerLedger.count({ where: { customerId: id } }),
        ]);
        return (0, pagination_util_1.paginate)(ledger, total, page, limit);
    }
    async create(dto, userId) {
        const customer = await this.prisma.customer.create({ data: { ...dto, createdById: userId } });
        if (dto.openingBalance && Number(dto.openingBalance) > 0) {
            await this.prisma.customerLedger.create({ data: { customerId: customer.id, type: client_1.CustomerLedgerType.OPENING_BALANCE, amount: dto.openingBalance, balance: dto.openingBalance, note: 'Opening balance' } });
        }
        return customer;
    }
    async update(id, dto) { await this.findOne(id); return this.prisma.customer.update({ where: { id }, data: dto }); }
    async remove(id) { await this.findOne(id); await this.prisma.customer.update({ where: { id }, data: this.prisma.softDelete() }); return { message: 'Customer deleted successfully' }; }
    async makePayment(customerId, dto) {
        const customer = await this.findOne(customerId);
        const currentDue = await this.calculateDue(customerId);
        await this.prisma.customerPayment.create({ data: { customerId, amount: dto.amount, paymentMethod: dto.paymentMethod, note: dto.note, paymentDate: dto.paymentDate || new Date() } });
        const newBalance = currentDue - Number(dto.amount);
        await this.prisma.customerLedger.create({ data: { customerId, type: client_1.CustomerLedgerType.PAYMENT, amount: dto.amount, balance: newBalance, note: dto.note || 'Payment received' } });
        if (dto.paymentMethod === 'CASH') {
            const lastEntry = await this.prisma.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
            await this.prisma.cashBook.create({ data: { type: client_1.CashBookType.IN, source: client_1.CashBookSource.PAYMENT_RECEIVED, referenceId: customerId, amount: dto.amount, balance: (Number(lastEntry?.balance) || 0) + Number(dto.amount), description: `Payment from customer: ${customer.name}` } });
        }
        return { message: 'Payment recorded successfully', newDue: newBalance };
    }
    async addSaleDue(customerId, amount, referenceId) {
        const currentDue = await this.calculateDue(customerId);
        await this.prisma.customerLedger.create({ data: { customerId, type: client_1.CustomerLedgerType.SALE_DUE, referenceId, amount, balance: currentDue + amount, note: 'Sale due' } });
    }
    async calculateDue(customerId) {
        const ledger = await this.prisma.customerLedger.findMany({ where: { customerId }, orderBy: { createdAt: 'desc' }, take: 1 });
        return Number(ledger[0]?.balance) || 0;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map