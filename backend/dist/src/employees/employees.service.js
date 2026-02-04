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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_util_1 = require("../common/utils/pagination.util");
const library_1 = require("@prisma/client/runtime/library");
let EmployeesService = class EmployeesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.employee.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                address: dto.address,
                nid: dto.nid,
                designation: dto.designation,
                department: dto.department,
                joinDate: dto.joinDate ? new Date(dto.joinDate) : new Date(),
                basicSalary: new library_1.Decimal(dto.basicSalary || 0),
                image: dto.image,
            },
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = query;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { designation: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.employee.findMany({
                where,
                include: { _count: { select: { salaryPayments: true } } },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.employee.count({ where }),
        ]);
        return { data, meta: (0, pagination_util_1.getPaginationMeta)(total, page, limit) };
    }
    async findOne(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id, deletedAt: null },
            include: { salaryPayments: { orderBy: { paymentDate: 'desc' }, take: 12 } },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        return employee;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.employee.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.employee.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map