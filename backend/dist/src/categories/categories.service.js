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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder);
        const searchQuery = (0, pagination_util_1.buildSearchQuery)(search, ['name', 'code']);
        const where = {
            ...this.prisma.notDeleted(),
            ...searchQuery,
        };
        const [categories, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    _count: { select: { products: true, subcategories: true } },
                },
            }),
            this.prisma.category.count({ where }),
        ]);
        const formatted = categories.map((cat) => ({
            ...cat,
            productsCount: cat._count.products,
            subcategoriesCount: cat._count.subcategories,
            _count: undefined,
        }));
        return (0, pagination_util_1.paginate)(formatted, total, page, limit);
    }
    async findOne(id) {
        const category = await this.prisma.category.findFirst({
            where: { id, ...this.prisma.notDeleted() },
            include: {
                subcategories: { where: this.prisma.notDeleted() },
                _count: { select: { products: true } },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return {
            ...category,
            productsCount: category._count.products,
            _count: undefined,
        };
    }
    async create(createCategoryDto) {
        const existing = await this.prisma.category.findFirst({
            where: { name: createCategoryDto.name, ...this.prisma.notDeleted() },
        });
        if (existing) {
            throw new common_1.ConflictException('Category name already exists');
        }
        if (createCategoryDto.code) {
            const existingCode = await this.prisma.category.findUnique({
                where: { code: createCategoryDto.code },
            });
            if (existingCode) {
                throw new common_1.ConflictException('Category code already exists');
            }
        }
        return this.prisma.category.create({ data: createCategoryDto });
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existing = await this.prisma.category.findFirst({
                where: { name: updateCategoryDto.name, ...this.prisma.notDeleted() },
            });
            if (existing) {
                throw new common_1.ConflictException('Category name already exists');
            }
        }
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.category.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map