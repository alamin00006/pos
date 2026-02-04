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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let PurchasesService = class PurchasesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateInvoiceNo() {
        const today = new Date();
        const prefix = `PUR${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
        const lastPurchase = await this.prisma.purchase.findFirst({
            where: { invoiceNo: { startsWith: prefix } },
            orderBy: { invoiceNo: 'desc' },
        });
        let sequence = 1;
        if (lastPurchase) {
            const lastSeq = parseInt(lastPurchase.invoiceNo.slice(-4));
            sequence = lastSeq + 1;
        }
        return `${prefix}${String(sequence).padStart(4, '0')}`;
    }
    async create(dto, userId) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: dto.supplierId, deletedAt: null },
        });
        if (!supplier) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        const productIds = dto.items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, deletedAt: null },
        });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestException('One or more products not found');
        }
        const invoiceNo = await this.generateInvoiceNo();
        const subtotal = dto.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const total = subtotal - (dto.discount || 0) + (dto.tax || 0) + (dto.shippingCost || 0);
        const paidAmount = dto.paidAmount || 0;
        const dueAmount = total - paidAmount;
        let paymentStatus = client_1.PaymentStatus.PENDING;
        if (paidAmount >= total) {
            paymentStatus = client_1.PaymentStatus.PAID;
        }
        else if (paidAmount > 0) {
            paymentStatus = client_1.PaymentStatus.PARTIAL;
        }
        return this.prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    invoiceNo,
                    supplierId: dto.supplierId,
                    userId,
                    subtotal: new library_1.Decimal(subtotal),
                    discount: new library_1.Decimal(dto.discount || 0),
                    tax: new library_1.Decimal(dto.tax || 0),
                    shippingCost: new library_1.Decimal(dto.shippingCost || 0),
                    total: new library_1.Decimal(total),
                    paidAmount: new library_1.Decimal(paidAmount),
                    dueAmount: new library_1.Decimal(dueAmount),
                    status: client_1.PurchaseStatus.RECEIVED,
                    paymentStatus,
                    note: dto.note,
                    purchaseItems: {
                        create: dto.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: new library_1.Decimal(item.unitPrice),
                            total: new library_1.Decimal(item.quantity * item.unitPrice),
                        })),
                    },
                },
                include: {
                    supplier: true,
                    purchaseItems: { include: { product: true } },
                    user: { select: { id: true, name: true, email: true } },
                },
            });
            for (const item of dto.items) {
                await tx.stockLedger.create({
                    data: {
                        productId: item.productId,
                        type: client_1.StockLedgerType.IN,
                        source: client_1.StockLedgerSource.PURCHASE,
                        referenceId: purchase.id,
                        quantity: item.quantity,
                        note: `Purchase ${invoiceNo}`,
                    },
                });
            }
            const lastLedger = await tx.supplierLedger.findFirst({
                where: { supplierId: dto.supplierId },
                orderBy: { createdAt: 'desc' },
            });
            const previousBalance = lastLedger?.balance || supplier.openingBalance;
            if (dueAmount > 0) {
                await tx.supplierLedger.create({
                    data: {
                        supplierId: dto.supplierId,
                        type: client_1.SupplierLedgerType.PURCHASE_DUE,
                        referenceId: purchase.id,
                        amount: new library_1.Decimal(dueAmount),
                        balance: new library_1.Decimal(Number(previousBalance) + dueAmount),
                        note: `Purchase ${invoiceNo}`,
                    },
                });
            }
            if (paidAmount > 0) {
                await tx.payment.create({
                    data: {
                        purchaseId: purchase.id,
                        supplierId: dto.supplierId,
                        amount: new library_1.Decimal(paidAmount),
                        paymentMethod: dto.paymentMethod,
                        note: `Payment for purchase ${invoiceNo}`,
                    },
                });
                const lastCashBook = await tx.cashBook.findFirst({
                    orderBy: { createdAt: 'desc' },
                });
                const cashBalance = lastCashBook?.balance || new library_1.Decimal(0);
                await tx.cashBook.create({
                    data: {
                        type: client_1.CashBookType.OUT,
                        source: client_1.CashBookSource.PURCHASE,
                        referenceId: purchase.id,
                        amount: new library_1.Decimal(paidAmount),
                        balance: new library_1.Decimal(Number(cashBalance) - paidAmount),
                        description: `Purchase payment ${invoiceNo}`,
                    },
                });
            }
            return purchase;
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', supplierId, status, paymentStatus, startDate, endDate } = query;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { invoiceNo: { contains: search, mode: 'insensitive' } },
                { supplier: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }
        if (supplierId)
            where.supplierId = supplierId;
        if (status)
            where.status = status;
        if (paymentStatus)
            where.paymentStatus = paymentStatus;
        if (startDate || endDate) {
            where.purchaseDate = {};
            if (startDate)
                where.purchaseDate.gte = new Date(startDate);
            if (endDate)
                where.purchaseDate.lte = new Date(endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.purchase.findMany({
                where,
                include: {
                    supplier: true,
                    purchaseItems: { include: { product: true } },
                    user: { select: { id: true, name: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.purchase.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const purchase = await this.prisma.purchase.findUnique({
            where: { id, deletedAt: null },
            include: {
                supplier: true,
                purchaseItems: { include: { product: true } },
                payments: true,
                user: { select: { id: true, name: true, email: true } },
            },
        });
        if (!purchase) {
            throw new common_1.NotFoundException('Purchase not found');
        }
        return purchase;
    }
    async update(id, dto) {
        const purchase = await this.findOne(id);
        let updateData = { ...dto };
        if (dto.discount !== undefined || dto.tax !== undefined || dto.shippingCost !== undefined) {
            const subtotal = Number(purchase.subtotal);
            const discount = dto.discount ?? Number(purchase.discount);
            const tax = dto.tax ?? Number(purchase.tax);
            const shippingCost = dto.shippingCost ?? Number(purchase.shippingCost);
            const total = subtotal - discount + tax + shippingCost;
            const dueAmount = total - Number(purchase.paidAmount);
            updateData.total = new library_1.Decimal(total);
            updateData.dueAmount = new library_1.Decimal(dueAmount);
            if (dueAmount <= 0) {
                updateData.paymentStatus = client_1.PaymentStatus.PAID;
            }
            else if (Number(purchase.paidAmount) > 0) {
                updateData.paymentStatus = client_1.PaymentStatus.PARTIAL;
            }
            else {
                updateData.paymentStatus = client_1.PaymentStatus.PENDING;
            }
        }
        return this.prisma.purchase.update({
            where: { id },
            data: updateData,
            include: {
                supplier: true,
                purchaseItems: { include: { product: true } },
            },
        });
    }
    async addPayment(id, dto) {
        const purchase = await this.findOne(id);
        if (Number(purchase.dueAmount) <= 0) {
            throw new common_1.BadRequestException('This purchase is already fully paid');
        }
        if (dto.amount > Number(purchase.dueAmount)) {
            throw new common_1.BadRequestException(`Payment amount cannot exceed due amount of ${purchase.dueAmount}`);
        }
        return this.prisma.$transaction(async (tx) => {
            const newPaidAmount = Number(purchase.paidAmount) + dto.amount;
            const newDueAmount = Number(purchase.total) - newPaidAmount;
            let paymentStatus = client_1.PaymentStatus.PARTIAL;
            if (newDueAmount <= 0) {
                paymentStatus = client_1.PaymentStatus.PAID;
            }
            const updatedPurchase = await tx.purchase.update({
                where: { id },
                data: {
                    paidAmount: new library_1.Decimal(newPaidAmount),
                    dueAmount: new library_1.Decimal(newDueAmount),
                    paymentStatus,
                },
                include: {
                    supplier: true,
                    purchaseItems: { include: { product: true } },
                },
            });
            await tx.payment.create({
                data: {
                    purchaseId: id,
                    supplierId: purchase.supplierId,
                    amount: new library_1.Decimal(dto.amount),
                    paymentMethod: dto.paymentMethod,
                    note: dto.note || `Payment for purchase ${purchase.invoiceNo}`,
                },
            });
            const lastLedger = await tx.supplierLedger.findFirst({
                where: { supplierId: purchase.supplierId },
                orderBy: { createdAt: 'desc' },
            });
            const previousBalance = lastLedger?.balance || new library_1.Decimal(0);
            await tx.supplierLedger.create({
                data: {
                    supplierId: purchase.supplierId,
                    type: client_1.SupplierLedgerType.PAYMENT,
                    referenceId: id,
                    amount: new library_1.Decimal(dto.amount),
                    balance: new library_1.Decimal(Number(previousBalance) - dto.amount),
                    note: `Payment for purchase ${purchase.invoiceNo}`,
                },
            });
            const lastCashBook = await tx.cashBook.findFirst({
                orderBy: { createdAt: 'desc' },
            });
            const cashBalance = lastCashBook?.balance || new library_1.Decimal(0);
            await tx.cashBook.create({
                data: {
                    type: client_1.CashBookType.OUT,
                    source: client_1.CashBookSource.PAYMENT_MADE,
                    referenceId: id,
                    amount: new library_1.Decimal(dto.amount),
                    balance: new library_1.Decimal(Number(cashBalance) - dto.amount),
                    description: `Purchase payment ${purchase.invoiceNo}`,
                },
            });
            return updatedPurchase;
        });
    }
    async getReceipt(id) {
        const purchase = await this.findOne(id);
        return {
            ...purchase,
            receiptType: 'PURCHASE',
            generatedAt: new Date(),
        };
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.purchase.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async getSupplierPurchases(supplierId, query) {
        return this.findAll({ ...query, supplierId });
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map