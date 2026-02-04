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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let BrandsService = class BrandsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder);
        const searchQuery = (0, pagination_util_1.buildSearchQuery)(search, ['name']);
        const where = {
            ...this.prisma.notDeleted(),
            ...searchQuery,
        };
        const [brands, total] = await Promise.all([
            this.prisma.brand.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    _count: { select: { products: true } },
                },
            }),
            this.prisma.brand.count({ where }),
        ]);
        const formattedBrands = brands.map((brand) => ({
            ...brand,
            productsCount: brand._count.products,
            _count: undefined,
        }));
        return (0, pagination_util_1.paginate)(formattedBrands, total, page, limit);
    }
    async findOne(id) {
        const brand = await this.prisma.brand.findFirst({
            where: { id, ...this.prisma.notDeleted() },
            include: {
                _count: { select: { products: true } },
            },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        return {
            ...brand,
            productsCount: brand._count.products,
            _count: undefined,
        };
    }
    async create(createBrandDto) {
        const existing = await this.prisma.brand.findFirst({
            where: { name: createBrandDto.name, ...this.prisma.notDeleted() },
        });
        if (existing) {
            throw new common_1.ConflictException('Brand name already exists');
        }
        return this.prisma.brand.create({ data: createBrandDto });
    }
    async update(id, updateBrandDto) {
        const brand = await this.findOne(id);
        if (updateBrandDto.name && updateBrandDto.name !== brand.name) {
            const existing = await this.prisma.brand.findFirst({
                where: { name: updateBrandDto.name, ...this.prisma.notDeleted() },
            });
            if (existing) {
                throw new common_1.ConflictException('Brand name already exists');
            }
        }
        return this.prisma.brand.update({
            where: { id },
            data: updateBrandDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.brand.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'Brand deleted successfully' };
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map