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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
let PermissionsService = class PermissionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const { skip, take } = (0, pagination_util_1.buildPaginationQuery)(page, limit);
        const orderBy = (0, pagination_util_1.buildOrderByQuery)(sortBy, sortOrder, 'key');
        const searchQuery = (0, pagination_util_1.buildSearchQuery)(search, ['key', 'name', 'module']);
        const where = { ...searchQuery };
        const [permissions, total] = await Promise.all([
            this.prisma.permission.findMany({
                where,
                skip,
                take,
                orderBy,
            }),
            this.prisma.permission.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(permissions, total, page, limit);
    }
    async findAllGrouped() {
        const permissions = await this.prisma.permission.findMany({
            orderBy: [{ module: 'asc' }, { key: 'asc' }],
        });
        const grouped = permissions.reduce((acc, permission) => {
            const module = permission.module || 'Other';
            if (!acc[module]) {
                acc[module] = [];
            }
            acc[module].push(permission);
            return acc;
        }, {});
        return grouped;
    }
    async findByKey(key) {
        return this.prisma.permission.findUnique({
            where: { key },
        });
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map