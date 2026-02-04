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
exports.ReturnsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
let ReturnsService = class ReturnsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateReturnNo() {
        const today = new Date();
        const prefix = `RET${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
        const lastReturn = await this.prisma.return.findFirst({
            where: { returnNo: { startsWith: prefix } },
            orderBy: { returnNo: 'desc' },
        });
        let sequence = 1;
        if (lastReturn) {
            const lastSeq = parseInt(lastReturn.returnNo.slice(-4));
            sequence = lastSeq + 1;
        }
        return `${prefix}${String(sequence).padStart(4, '0')}`;
    }
    async create(dto) {
        const sale = await this.prisma.sale.findUnique({
            where: { id: dto.saleId, deletedAt: null },
        });
        if (!sale)
            throw new common_1.NotFoundException('Sale not found');
        const returnNo = await this.generateReturnNo();
        const total = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        return this.prisma.$transaction(async (tx) => {
            const returnRecord = await tx.return.create({
                data: {
                    returnNo,
                    saleId: dto.saleId,
                    total: new library_1.Decimal(total),
                    note: dto.note,
                    returnItems: {
                        create: dto.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: new library_1.Decimal(item.unitPrice),
                            total: new library_1.Decimal(item.quantity * item.unitPrice),
                        })),
                    },
                },
                include: { returnItems: { include: { product: true } }, sale: true },
            });
            for (const item of dto.items) {
                await tx.stockLedger.create({
                    data: {
                        productId: item.productId,
                        type: client_1.StockLedgerType.IN,
                        source: client_1.StockLedgerSource.RETURN,
                        referenceId: returnRecord.id,
                        quantity: item.quantity,
                        note: `Return ${returnNo}`,
                    },
                });
            }
            return returnRecord;
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { returnNo: { contains: search, mode: 'insensitive' } },
                { sale: { invoiceNo: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.return.findMany({
                where,
                include: { sale: true, returnItems: { include: { product: true } } },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.return.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const returnRecord = await this.prisma.return.findUnique({
            where: { id, deletedAt: null },
            include: { sale: true, returnItems: { include: { product: true } } },
        });
        if (!returnRecord)
            throw new common_1.NotFoundException('Return not found');
        return returnRecord;
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.return.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.ReturnsService = ReturnsService;
exports.ReturnsService = ReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReturnsService);
//# sourceMappingURL=returns.service.js.map