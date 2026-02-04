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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
let SuppliersService = class SuppliersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder);
        const searchQuery = (0, pagination_util_1.buildSearchQuery)(search, ['name', 'email', 'phone', 'company']);
        const where = {
            ...this.prisma.notDeleted(),
            ...searchQuery,
        };
        const [suppliers, total] = await Promise.all([
            this.prisma.supplier.findMany({
                where,
                skip,
                take,
                orderBy,
            }),
            this.prisma.supplier.count({ where }),
        ]);
        const suppliersWithDue = await Promise.all(suppliers.map(async (supplier) => {
            const due = await this.calculateDue(supplier.id);
            return { ...supplier, due };
        }));
        return (0, pagination_util_1.paginate)(suppliersWithDue, total, page, limit);
    }
    async getDueReport(query) {
        const { page, limit } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const suppliers = await this.prisma.supplier.findMany({
            where: this.prisma.notDeleted(),
        });
        const suppliersWithDue = await Promise.all(suppliers.map(async (supplier) => {
            const due = await this.calculateDue(supplier.id);
            return { ...supplier, due };
        }));
        const suppliersWithPositiveDue = suppliersWithDue.filter((s) => s.due > 0);
        const paginatedSuppliers = suppliersWithPositiveDue.slice(skip, skip + take);
        return (0, pagination_util_1.paginate)(paginatedSuppliers, suppliersWithPositiveDue.length, page, limit);
    }
    async findOne(id) {
        const supplier = await this.prisma.supplier.findFirst({
            where: { id, ...this.prisma.notDeleted() },
        });
        if (!supplier) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        const due = await this.calculateDue(id);
        return { ...supplier, due };
    }
    async getLedger(id, query) {
        const { page, limit } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        await this.findOne(id);
        const [ledger, total] = await Promise.all([
            this.prisma.supplierLedger.findMany({
                where: { supplierId: id },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.supplierLedger.count({ where: { supplierId: id } }),
        ]);
        return (0, pagination_util_1.paginate)(ledger, total, page, limit);
    }
    async create(createSupplierDto, userId) {
        const supplier = await this.prisma.supplier.create({
            data: {
                ...createSupplierDto,
                createdById: userId,
            },
        });
        if (createSupplierDto.openingBalance && Number(createSupplierDto.openingBalance) > 0) {
            await this.prisma.supplierLedger.create({
                data: {
                    supplierId: supplier.id,
                    type: client_1.SupplierLedgerType.OPENING_BALANCE,
                    amount: createSupplierDto.openingBalance,
                    balance: createSupplierDto.openingBalance,
                    note: 'Opening balance',
                },
            });
        }
        return supplier;
    }
    async update(id, updateSupplierDto) {
        await this.findOne(id);
        return this.prisma.supplier.update({
            where: { id },
            data: updateSupplierDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.supplier.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'Supplier deleted successfully' };
    }
    async makePayment(supplierId, paymentDto) {
        const supplier = await this.findOne(supplierId);
        const currentDue = await this.calculateDue(supplierId);
        await this.prisma.supplierPayment.create({
            data: {
                supplierId,
                amount: paymentDto.amount,
                paymentMethod: paymentDto.paymentMethod,
                note: paymentDto.note,
                paymentDate: paymentDto.paymentDate || new Date(),
            },
        });
        const newBalance = currentDue - Number(paymentDto.amount);
        await this.prisma.supplierLedger.create({
            data: {
                supplierId,
                type: client_1.SupplierLedgerType.PAYMENT,
                amount: paymentDto.amount,
                balance: newBalance,
                note: paymentDto.note || 'Payment made',
            },
        });
        if (paymentDto.paymentMethod === 'CASH') {
            const lastCashEntry = await this.prisma.cashBook.findFirst({
                orderBy: { createdAt: 'desc' },
            });
            await this.prisma.cashBook.create({
                data: {
                    type: client_1.CashBookType.OUT,
                    source: client_1.CashBookSource.PAYMENT_MADE,
                    referenceId: supplierId,
                    amount: paymentDto.amount,
                    balance: (Number(lastCashEntry?.balance) || 0) - Number(paymentDto.amount),
                    description: `Payment to supplier: ${supplier.name}`,
                },
            });
        }
        return { message: 'Payment recorded successfully', newDue: newBalance };
    }
    async addPurchaseDue(supplierId, amount, referenceId) {
        const currentDue = await this.calculateDue(supplierId);
        const newBalance = currentDue + amount;
        await this.prisma.supplierLedger.create({
            data: {
                supplierId,
                type: client_1.SupplierLedgerType.PURCHASE_DUE,
                referenceId,
                amount,
                balance: newBalance,
                note: 'Purchase due',
            },
        });
    }
    async calculateDue(supplierId) {
        const ledger = await this.prisma.supplierLedger.findMany({
            where: { supplierId },
            orderBy: { createdAt: 'desc' },
            take: 1,
        });
        return Number(ledger[0]?.balance) || 0;
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map