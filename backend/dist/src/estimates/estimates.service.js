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
exports.EstimatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const library_1 = require("@prisma/client/runtime/library");
let EstimatesService = class EstimatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateEstimateNo() {
        const today = new Date();
        const prefix = `EST${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
        const lastEstimate = await this.prisma.estimate.findFirst({
            where: { estimateNo: { startsWith: prefix } },
            orderBy: { estimateNo: 'desc' },
        });
        let sequence = 1;
        if (lastEstimate)
            sequence = parseInt(lastEstimate.estimateNo.slice(-4)) + 1;
        return `${prefix}${String(sequence).padStart(4, '0')}`;
    }
    async create(dto) {
        const estimateNo = await this.generateEstimateNo();
        const subtotal = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const total = subtotal - (dto.discount || 0) + (dto.tax || 0);
        return this.prisma.estimate.create({
            data: {
                estimateNo,
                customerId: dto.customerId,
                subtotal: new library_1.Decimal(subtotal),
                discount: new library_1.Decimal(dto.discount || 0),
                tax: new library_1.Decimal(dto.tax || 0),
                total: new library_1.Decimal(total),
                note: dto.note,
                validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
                estimateItems: {
                    create: dto.items.map((item) => ({
                        productName: item.productName,
                        quantity: item.quantity,
                        unitPrice: new library_1.Decimal(item.unitPrice),
                        total: new library_1.Decimal(item.quantity * item.unitPrice),
                    })),
                },
            },
            include: { customer: true, estimateItems: true },
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', customerId } = query;
        const where = { deletedAt: null };
        if (search)
            where.estimateNo = { contains: search, mode: 'insensitive' };
        if (customerId)
            where.customerId = customerId;
        const [data, total] = await Promise.all([
            this.prisma.estimate.findMany({
                where,
                include: { customer: true, estimateItems: true },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.estimate.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const estimate = await this.prisma.estimate.findUnique({
            where: { id, deletedAt: null },
            include: { customer: true, estimateItems: true },
        });
        if (!estimate)
            throw new common_1.NotFoundException('Estimate not found');
        return estimate;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.estimate.update({
            where: { id },
            data: { note: dto.note, validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined },
            include: { customer: true, estimateItems: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.estimate.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.EstimatesService = EstimatesService;
exports.EstimatesService = EstimatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EstimatesService);
//# sourceMappingURL=estimates.service.js.map