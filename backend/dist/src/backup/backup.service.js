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
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BackupService = class BackupService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBackupInfo() {
        const [usersCount, customersCount, suppliersCount, productsCount, salesCount, purchasesCount, expensesCount] = await Promise.all([
            this.prisma.user.count({ where: { deletedAt: null } }),
            this.prisma.customer.count({ where: { deletedAt: null } }),
            this.prisma.supplier.count({ where: { deletedAt: null } }),
            this.prisma.product.count({ where: { deletedAt: null } }),
            this.prisma.sale.count({ where: { deletedAt: null } }),
            this.prisma.purchase.count({ where: { deletedAt: null } }),
            this.prisma.expense.count({ where: { deletedAt: null } }),
        ]);
        return {
            message: 'Database backup information',
            instructions: [
                'To create a database backup, run: pg_dump -U <username> -d <database> > backup.sql',
                'To restore from backup, run: psql -U <username> -d <database> < backup.sql',
                'Ensure you have proper database credentials and access rights.',
            ],
            statistics: {
                users: usersCount,
                customers: customersCount,
                suppliers: suppliersCount,
                products: productsCount,
                sales: salesCount,
                purchases: purchasesCount,
                expenses: expensesCount,
            },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BackupService);
//# sourceMappingURL=backup.service.js.map