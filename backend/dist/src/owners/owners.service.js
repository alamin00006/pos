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
exports.OwnersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let OwnersService = class OwnersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder);
        const searchQuery = (0, pagination_util_1.buildSearchQuery)(search, ['name', 'email', 'phone']);
        const where = {
            ...this.prisma.notDeleted(),
            ...searchQuery,
        };
        const [owners, total] = await Promise.all([
            this.prisma.owner.findMany({ where, skip, take, orderBy }),
            this.prisma.owner.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(owners, total, page, limit);
    }
    async findOne(id) {
        const owner = await this.prisma.owner.findFirst({
            where: { id, ...this.prisma.notDeleted() },
        });
        if (!owner) {
            throw new common_1.NotFoundException('Owner not found');
        }
        return owner;
    }
    async create(createOwnerDto) {
        return this.prisma.owner.create({ data: createOwnerDto });
    }
    async update(id, updateOwnerDto) {
        await this.findOne(id);
        return this.prisma.owner.update({
            where: { id },
            data: updateOwnerDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.owner.update({
            where: { id },
            data: this.prisma.softDelete(),
        });
        return { message: 'Owner deleted successfully' };
    }
};
exports.OwnersService = OwnersService;
exports.OwnersService = OwnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OwnersService);
//# sourceMappingURL=owners.service.js.map