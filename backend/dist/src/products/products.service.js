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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder, categoryId, subcategoryId, brandId } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder);
        const where = {
            ...this.prisma.notDeleted(),
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { productCode: { contains: search, mode: 'insensitive' } },
                { barcode: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (subcategoryId)
            where.subcategoryId = subcategoryId;
        if (brandId)
            where.brandId = brandId;
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    category: { select: { id: true, name: true } },
                    subcategory: { select: { id: true, name: true } },
                    brand: { select: { id: true, name: true } },
                    unit: { select: { id: true, name: true, shortName: true } },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const stock = await this.calculateStock(product.id);
            return { ...product, stock };
        }));
        return (0, pagination_util_1.paginate)(productsWithStock, total, page, limit);
    }
    async search(q) {
        if (!q || q.length < 2)
            return [];
        const products = await this.prisma.product.findMany({
            where: {
                ...this.prisma.notDeleted(),
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { productCode: { contains: q, mode: 'insensitive' } },
                    { barcode: { contains: q, mode: 'insensitive' } },
                ],
            },
            take: 20,
            include: {
                category: { select: { id: true, name: true } },
                unit: { select: { id: true, name: true, shortName: true } },
            },
        });
        return Promise.all(products.map(async (product) => ({
            ...product,
            stock: await this.calculateStock(product.id),
        })));
    }
    async findByBarcode(barcode) {
        const product = await this.prisma.product.findFirst({
            where: { barcode, ...this.prisma.notDeleted() },
            include: {
                category: { select: { id: true, name: true } },
                subcategory: { select: { id: true, name: true } },
                brand: { select: { id: true, name: true } },
                unit: { select: { id: true, name: true, shortName: true } },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            ...product,
            stock: await this.calculateStock(product.id),
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, ...this.prisma.notDeleted() },
            include: {
                category: { select: { id: true, name: true } },
                subcategory: { select: { id: true, name: true } },
                brand: { select: { id: true, name: true } },
                unit: { select: { id: true, name: true, shortName: true } },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            ...product,
            stock: await this.calculateStock(product.id),
        };
    }
    async getStock(id) {
        await this.findOne(id);
        const stock = await this.calculateStock(id);
        return { productId: id, stock };
    }
    async create(createProductDto) {
        const existingCode = await this.prisma.product.findUnique({
            where: { productCode: createProductDto.productCode },
        });
        if (existingCode) {
            throw new common_1.ConflictException('Product code already exists');
        }
        if (createProductDto.barcode) {
            const existingBarcode = await this.prisma.product.findUnique({
                where: { barcode: createProductDto.barcode },
            });
            if (existingBarcode) {
                throw new common_1.ConflictException('Barcode already exists');
            }
        }
        return this.prisma.product.create({
            data: createProductDto,
            include: {
                category: { select: { id: true, name: true } },
                subcategory: { select: { id: true, name: true } },
                brand: { select: { id: true, name: true } },
                unit: { select: { id: true, name: true, shortName: true } },
            },
        });
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (updateProductDto.productCode && updateProductDto.productCode !== product.productCode) {
            const existing = await this.prisma.product.findUnique({
                where: { productCode: updateProductDto.productCode },
            });
            if (existing) {
                throw new common_1.ConflictException('Product code already exists');
            }
        }
        if (updateProductDto.barcode && updateProductDto.barcode !== product.barcode) {
            const existing = await this.prisma.product.findUnique({
                where: { barcode: updateProductDto.barcode },
            });
            if (existing) {
                throw new common_1.ConflictException('Barcode already exists');
            }
        }
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                category: { select: { id: true, name: true } },
                subcategory: { select: { id: true, name: true } },
                brand: { select: { id: true, name: true } },
                unit: { select: { id: true, name: true, shortName: true } },
            },
        });
    }
    async updateSellPrice(id, sellPrice) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { sellPrice },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.product.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'Product deleted successfully' };
    }
    async calculateStock(productId) {
        const result = await this.prisma.stockLedger.aggregate({
            where: { productId },
            _sum: {
                quantity: true,
            },
        });
        return result._sum.quantity || 0;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map