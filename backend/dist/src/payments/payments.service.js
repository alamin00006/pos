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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizePaymentMethod(input) {
        if (!input)
            return client_1.PaymentMethod.CASH;
        const value = input.toUpperCase();
        switch (value) {
            case 'CASH':
                return client_1.PaymentMethod.CASH;
            case 'CARD':
                return client_1.PaymentMethod.CARD;
            case 'BANK':
            case 'BANK_TRANSFER':
                return client_1.PaymentMethod.BANK_TRANSFER;
            case 'MOBILE_MONEY':
            case 'MOBILE_PAYMENT':
                return client_1.PaymentMethod.MOBILE_PAYMENT;
            case 'CHEQUE':
                return client_1.PaymentMethod.CHEQUE;
            case 'OTHER':
                return client_1.PaymentMethod.OTHER;
            default:
                return client_1.PaymentMethod.CASH;
        }
    }
    async create(dto) {
        const paymentDate = dto.date ? new Date(dto.date) : new Date();
        const paymentMethod = this.normalizePaymentMethod(dto.paymentMethod);
        return this.prisma.$transaction(async (tx) => {
            if (dto.saleId) {
                const sale = await tx.sale.findFirst({ where: { id: dto.saleId, deletedAt: null } });
                if (!sale)
                    throw new common_1.NotFoundException('Sale not found');
                if (sale.paymentStatus === client_1.PaymentStatus.PAID) {
                    throw new common_1.BadRequestException('Sale is already fully paid');
                }
                const newPaidAmount = Number(sale.paidAmount) + dto.amount;
                const newDueAmount = Math.max(0, Number(sale.total) - newPaidAmount);
                let paymentStatus = client_1.PaymentStatus.PARTIAL;
                if (newDueAmount <= 0)
                    paymentStatus = client_1.PaymentStatus.PAID;
                const payment = await tx.payment.create({
                    data: {
                        saleId: sale.id,
                        customerId: sale.customerId ?? dto.customerId,
                        amount: dto.amount,
                        paymentMethod,
                        note: dto.notes,
                        paymentDate,
                    },
                });
                await tx.sale.update({
                    where: { id: sale.id },
                    data: { paidAmount: newPaidAmount, dueAmount: newDueAmount, paymentStatus },
                });
                if (paymentMethod === client_1.PaymentMethod.CASH) {
                    const lastCashEntry = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
                    await tx.cashBook.create({
                        data: {
                            type: client_1.CashBookType.IN,
                            source: client_1.CashBookSource.PAYMENT_RECEIVED,
                            referenceId: sale.id,
                            amount: dto.amount,
                            balance: (Number(lastCashEntry?.balance) || 0) + dto.amount,
                            description: `Sale payment - Invoice #${sale.invoiceNo}`,
                        },
                    });
                }
                if (sale.customerId) {
                    const lastLedger = await tx.customerLedger.findFirst({
                        where: { customerId: sale.customerId },
                        orderBy: { createdAt: 'desc' },
                    });
                    const previousBalance = Number(lastLedger?.balance) || 0;
                    await tx.customerLedger.create({
                        data: {
                            customerId: sale.customerId,
                            type: client_1.CustomerLedgerType.PAYMENT,
                            referenceId: sale.id,
                            amount: dto.amount,
                            balance: previousBalance - dto.amount,
                            note: dto.notes || `Payment received - Invoice #${sale.invoiceNo}`,
                        },
                    });
                }
                return payment;
            }
            if (dto.purchaseId) {
                const purchase = await tx.purchase.findFirst({ where: { id: dto.purchaseId, deletedAt: null } });
                if (!purchase)
                    throw new common_1.NotFoundException('Purchase not found');
                if (Number(purchase.dueAmount) <= 0) {
                    throw new common_1.BadRequestException('This purchase is already fully paid');
                }
                if (dto.amount > Number(purchase.dueAmount)) {
                    throw new common_1.BadRequestException(`Payment amount cannot exceed due amount of ${purchase.dueAmount}`);
                }
                const newPaidAmount = Number(purchase.paidAmount) + dto.amount;
                const newDueAmount = Math.max(0, Number(purchase.total) - newPaidAmount);
                let paymentStatus = client_1.PaymentStatus.PARTIAL;
                if (newDueAmount <= 0)
                    paymentStatus = client_1.PaymentStatus.PAID;
                const payment = await tx.payment.create({
                    data: {
                        purchaseId: purchase.id,
                        supplierId: purchase.supplierId ?? dto.supplierId,
                        amount: dto.amount,
                        paymentMethod,
                        note: dto.notes,
                        paymentDate,
                    },
                });
                await tx.purchase.update({
                    where: { id: purchase.id },
                    data: { paidAmount: newPaidAmount, dueAmount: newDueAmount, paymentStatus },
                });
                if (paymentMethod === client_1.PaymentMethod.CASH) {
                    const lastCashEntry = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
                    await tx.cashBook.create({
                        data: {
                            type: client_1.CashBookType.OUT,
                            source: client_1.CashBookSource.PAYMENT_MADE,
                            referenceId: purchase.id,
                            amount: dto.amount,
                            balance: (Number(lastCashEntry?.balance) || 0) - dto.amount,
                            description: `Purchase payment ${purchase.invoiceNo}`,
                        },
                    });
                }
                if (purchase.supplierId) {
                    const lastLedger = await tx.supplierLedger.findFirst({
                        where: { supplierId: purchase.supplierId },
                        orderBy: { createdAt: 'desc' },
                    });
                    const previousBalance = Number(lastLedger?.balance) || 0;
                    await tx.supplierLedger.create({
                        data: {
                            supplierId: purchase.supplierId,
                            type: client_1.SupplierLedgerType.PAYMENT,
                            referenceId: purchase.id,
                            amount: dto.amount,
                            balance: previousBalance - dto.amount,
                            note: dto.notes || `Payment for purchase ${purchase.invoiceNo}`,
                        },
                    });
                }
                return payment;
            }
            return tx.payment.create({
                data: {
                    saleId: dto.saleId,
                    purchaseId: dto.purchaseId,
                    customerId: dto.customerId,
                    supplierId: dto.supplierId,
                    amount: dto.amount,
                    paymentMethod,
                    note: dto.notes,
                    paymentDate,
                },
            });
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', saleId, purchaseId, startDate, endDate } = query;
        const where = { deletedAt: null };
        if (saleId)
            where.saleId = saleId;
        if (purchaseId)
            where.purchaseId = purchaseId;
        if (startDate || endDate) {
            where.paymentDate = {};
            if (startDate)
                where.paymentDate.gte = new Date(startDate);
            if (endDate)
                where.paymentDate.lte = new Date(endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                include: { sale: true, purchase: true },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.payment.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id, deletedAt: null },
            include: { sale: true, purchase: true },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return payment;
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.payment.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map