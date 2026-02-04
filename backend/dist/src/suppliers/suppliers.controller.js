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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const suppliers_service_1 = require("./suppliers.service");
const create_supplier_dto_1 = require("./dto/create-supplier.dto");
const update_supplier_dto_1 = require("./dto/update-supplier.dto");
const supplier_payment_dto_1 = require("./dto/supplier-payment.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const decorators_1 = require("../common/decorators");
let SuppliersController = class SuppliersController {
    constructor(suppliersService) {
        this.suppliersService = suppliersService;
    }
    async findAll(query) {
        return this.suppliersService.findAll(query);
    }
    async getDueReport(query) {
        return this.suppliersService.getDueReport(query);
    }
    async findOne(id) {
        return this.suppliersService.findOne(id);
    }
    async getLedger(id, query) {
        return this.suppliersService.getLedger(id, query);
    }
    async create(createSupplierDto, userId) {
        return this.suppliersService.create(createSupplierDto, userId);
    }
    async update(id, updateSupplierDto) {
        return this.suppliersService.update(id, updateSupplierDto);
    }
    async remove(id) {
        return this.suppliersService.remove(id);
    }
    async makePayment(id, paymentDto) {
        return this.suppliersService.makePayment(id, paymentDto);
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('create_supplier'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all suppliers' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('due-report'),
    (0, decorators_1.Permissions)('supplier_due_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get suppliers with due amounts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getDueReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('create_supplier'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/ledger'),
    (0, decorators_1.Permissions)('supplier_ledger', 'supplier_ledger_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier ledger' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getLedger", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_supplier', 'create_supplier', 'purchase_add_supplier'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new supplier' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Permissions)('edit_supplier'),
    (0, swagger_1.ApiOperation)({ summary: 'Update supplier' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)('delete_supplier'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete supplier (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/payment'),
    (0, decorators_1.Permissions)('supplier_make_payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Make payment to supplier' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, supplier_payment_dto_1.SupplierPaymentDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "makePayment", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, swagger_1.ApiTags)('Suppliers'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('suppliers'),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map