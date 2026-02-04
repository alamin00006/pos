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
exports.DamagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let DamagesService = class DamagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateDamageNo() {
        const today = new Date();
        const prefix = `DMG${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
        const lastDamage = await this.prisma.damage.findFirst({
            where: { damageNo: { startsWith: prefix } },
            orderBy: { damageNo: 'desc' },
        });
        let sequence = 1;
        if (lastDamage)
            sequence = parseInt(lastDamage.damageNo.slice(-4)) + 1;
        return `${prefix}${String(sequence).padStart(4, '0')}`;
    }
    async create(dto) {
        const damageNo = await this.generateDamageNo();
        const total = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        return this.prisma.$transaction(async (tx) => {
            const damage = await tx.damage.create({
                data: {
                    damageNo,
                    total: new library_1.Decimal(total),
                    note: dto.note,
                    damageDate: dto.damageDate ? new Date(dto.damageDate) : new Date(),
                    damageItems: {
                        create: dto.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: new library_1.Decimal(item.unitPrice),
                            total: new library_1.Decimal(item.quantity * item.unitPrice),
                        })),
                    },
                },
                include: { damageItems: { include: { product: true } } },
            });
            for (const item of dto.items) {
                await tx.stockLedger.create({
                    data: {
                        productId: item.productId,
                        type: client_1.StockLedgerType.OUT,
                        source: client_1.StockLedgerSource.DAMAGE,
                        referenceId: damage.id,
                        quantity: item.quantity,
                        note: `Damage ${damageNo}`,
                    },
                });
            }
            return damage;
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const where = { deletedAt: null };
        if (search)
            where.damageNo = { contains: search, mode: 'insensitive' };
        const [data, total] = await Promise.all([
            this.prisma.damage.findMany({
                where,
                include: { damageItems: { include: { product: true } } },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.damage.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const damage = await this.prisma.damage.findUnique({
            where: { id, deletedAt: null },
            include: { damageItems: { include: { product: true } } },
        });
        if (!damage)
            throw new common_1.NotFoundException('Damage not found');
        return damage;
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.damage.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.DamagesService = DamagesService;
exports.DamagesService = DamagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DamagesService);
//# sourceMappingURL=damages.service.js.map