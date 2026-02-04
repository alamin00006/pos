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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
let StockService = class StockService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStockReport(query) {
        const { page, limit, search, sortBy, sortOrder, categoryId } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const where = {
            ...this.prisma.notDeleted(),
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { productCode: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId)
            where.categoryId = categoryId;
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder),
                include: {
                    category: { select: { id: true, name: true } },
                    unit: { select: { id: true, name: true, shortName: true } },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const stock = await this.calculateStock(product.id);
            const stockValue = Number(product.costPrice) * stock;
            return {
                ...product,
                stock,
                stockValue,
                isLowStock: stock <= product.alertQuantity,
            };
        }));
        return (0, pagination_util_1.paginate)(productsWithStock, total, page, limit);
    }
    async getLowStock(query) {
        const { page, limit } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const products = await this.prisma.product.findMany({
            where: this.prisma.notDeleted(),
            include: {
                category: { select: { id: true, name: true } },
                unit: { select: { id: true, name: true, shortName: true } },
            },
        });
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const stock = await this.calculateStock(product.id);
            return { ...product, stock };
        }));
        const lowStockProducts = productsWithStock.filter((p) => p.stock <= p.alertQuantity);
        const paginatedProducts = lowStockProducts.slice(skip, skip + take);
        return (0, pagination_util_1.paginate)(paginatedProducts, lowStockProducts.length, page, limit);
    }
    async getProductLedger(productId, query) {
        const { page, limit } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const product = await this.prisma.product.findFirst({
            where: { id: productId, ...this.prisma.notDeleted() },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const [ledger, total] = await Promise.all([
            this.prisma.stockLedger.findMany({
                where: { productId },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.stockLedger.count({ where: { productId } }),
        ]);
        let runningBalance = 0;
        const ledgerWithBalance = ledger.reverse().map((entry) => {
            runningBalance += entry.quantity;
            return { ...entry, balance: runningBalance };
        }).reverse();
        return (0, pagination_util_1.paginate)(ledgerWithBalance, total, page, limit);
    }
    async adjustStock(adjustStockDto) {
        const { productId, quantity, type, note } = adjustStockDto;
        const product = await this.prisma.product.findFirst({
            where: { id: productId, ...this.prisma.notDeleted() },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const adjustedQuantity = type === 'IN' ? quantity : -quantity;
        await this.prisma.stockLedger.create({
            data: {
                productId,
                type: type === 'IN' ? client_1.StockLedgerType.IN : client_1.StockLedgerType.OUT,
                source: client_1.StockLedgerSource.ADJUSTMENT,
                quantity: adjustedQuantity,
                note,
            },
        });
        const newStock = await this.calculateStock(productId);
        return { message: 'Stock adjusted successfully', stock: newStock };
    }
    async setOpeningStock(productId, quantity, note) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, ...this.prisma.notDeleted() },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.stockLedger.create({
            data: {
                productId,
                type: client_1.StockLedgerType.IN,
                source: client_1.StockLedgerSource.OPENING,
                quantity,
                note: note || 'Opening stock',
            },
        });
        return { message: 'Opening stock set successfully', stock: quantity };
    }
    async addStock(productId, quantity, source, referenceId, note) {
        return this.prisma.stockLedger.create({
            data: {
                productId,
                type: client_1.StockLedgerType.IN,
                source,
                quantity,
                referenceId,
                note,
            },
        });
    }
    async deductStock(productId, quantity, source, referenceId, note) {
        return this.prisma.stockLedger.create({
            data: {
                productId,
                type: client_1.StockLedgerType.OUT,
                source,
                quantity: -quantity,
                referenceId,
                note,
            },
        });
    }
    async calculateStock(productId) {
        const result = await this.prisma.stockLedger.aggregate({
            where: { productId },
            _sum: { quantity: true },
        });
        return result._sum.quantity || 0;
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockService);
//# sourceMappingURL=stock.service.js.map