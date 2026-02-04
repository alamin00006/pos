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
exports.SubcategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let SubcategoriesService = class SubcategoriesService {
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
        const [subcategories, total] = await Promise.all([
            this.prisma.subcategory.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    category: { select: { id: true, name: true } },
                    _count: { select: { products: true } },
                },
            }),
            this.prisma.subcategory.count({ where }),
        ]);
        const formatted = subcategories.map((sub) => ({
            ...sub,
            productsCount: sub._count.products,
            _count: undefined,
        }));
        return (0, pagination_util_1.paginate)(formatted, total, page, limit);
    }
    async findByCategory(categoryId) {
        return this.prisma.subcategory.findMany({
            where: {
                categoryId,
                ...this.prisma.notDeleted(),
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const subcategory = await this.prisma.subcategory.findFirst({
            where: { id, ...this.prisma.notDeleted() },
            include: {
                category: { select: { id: true, name: true } },
            },
        });
        if (!subcategory) {
            throw new common_1.NotFoundException('Subcategory not found');
        }
        return subcategory;
    }
    async create(createSubcategoryDto) {
        const category = await this.prisma.category.findFirst({
            where: { id: createSubcategoryDto.categoryId, ...this.prisma.notDeleted() },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const existing = await this.prisma.subcategory.findFirst({
            where: {
                name: createSubcategoryDto.name,
                categoryId: createSubcategoryDto.categoryId,
                ...this.prisma.notDeleted(),
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Subcategory name already exists in this category');
        }
        return this.prisma.subcategory.create({
            data: createSubcategoryDto,
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, updateSubcategoryDto) {
        await this.findOne(id);
        return this.prisma.subcategory.update({
            where: { id },
            data: updateSubcategoryDto,
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.subcategory.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'Subcategory deleted successfully' };
    }
};
exports.SubcategoriesService = SubcategoriesService;
exports.SubcategoriesService = SubcategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubcategoriesService);
//# sourceMappingURL=subcategories.service.js.map