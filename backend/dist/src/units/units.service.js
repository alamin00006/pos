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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let UnitsService = class UnitsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder);
        const searchQuery = (0, pagination_util_1.buildSearchQuery)(search, ['name', 'shortName']);
        const where = {
            ...this.prisma.notDeleted(),
            ...searchQuery,
        };
        const [units, total] = await Promise.all([
            this.prisma.unit.findMany({ where, skip, take, orderBy }),
            this.prisma.unit.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(units, total, page, limit);
    }
    async findOne(id) {
        const unit = await this.prisma.unit.findFirst({
            where: { id, ...this.prisma.notDeleted() },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        return unit;
    }
    async create(createUnitDto) {
        const existing = await this.prisma.unit.findFirst({
            where: { name: createUnitDto.name, ...this.prisma.notDeleted() },
        });
        if (existing) {
            throw new common_1.ConflictException('Unit name already exists');
        }
        return this.prisma.unit.create({ data: createUnitDto });
    }
    async update(id, updateUnitDto) {
        const unit = await this.findOne(id);
        if (updateUnitDto.name && updateUnitDto.name !== unit.name) {
            const existing = await this.prisma.unit.findFirst({
                where: { name: updateUnitDto.name, ...this.prisma.notDeleted() },
            });
            if (existing) {
                throw new common_1.ConflictException('Unit name already exists');
            }
        }
        return this.prisma.unit.update({
            where: { id },
            data: updateUnitDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.unit.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'Unit deleted successfully' };
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UnitsService);
//# sourceMappingURL=units.service.js.map