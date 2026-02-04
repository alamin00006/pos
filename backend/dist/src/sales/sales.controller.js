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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sales_service_1 = require("./sales.service");
const dto_1 = require("./dto");
const decorators_1 = require("../common/decorators");
let SalesController = class SalesController {
    constructor(salesService) {
        this.salesService = salesService;
    }
    async findAll(query) {
        return this.salesService.findAll(query);
    }
    async getTodaySales() {
        return this.salesService.getTodaySales();
    }
    async getSalesReport(query) {
        return this.salesService.getSalesReport(query);
    }
    async findOne(id) {
        return this.salesService.findOne(id);
    }
    async getReceipt(id) {
        return this.salesService.getReceipt(id);
    }
    async create(dto, userId) {
        return this.salesService.create(dto, userId);
    }
    async update(id, dto) {
        return this.salesService.update(id, dto);
    }
    async remove(id) {
        return this.salesService.remove(id);
    }
    async addPayment(id, dto) {
        return this.salesService.addPayment(id, dto);
    }
    async duplicate(id, userId) {
        return this.salesService.duplicate(id, userId);
    }
    async refund(id, dto) {
        return this.salesService.refund(id, dto);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('sales_list', 'add_sale'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sales with pagination and filtering' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SaleQueryDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('today'),
    (0, decorators_1.Permissions)('today_sold', 'dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today sales summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getTodaySales", null);
__decorate([
    (0, common_1.Get)('report'),
    (0, decorators_1.Permissions)('sales_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales report with date range' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SaleQueryDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('view_sale', 'sales_list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sale by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sale ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/receipt'),
    (0, decorators_1.Permissions)('sale_receipt'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sale receipt with company details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sale ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getReceipt", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_sale'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new sale (POS)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSaleDto, String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Permissions)('edit_sale_payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Update sale' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sale ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateSaleDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)('delete_return'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete sale (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sale ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/payment'),
    (0, decorators_1.Permissions)('edit_sale_payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Add payment to existing sale' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sale ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AddSalePaymentDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "addPayment", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, decorators_1.Permissions)('pos_duplicate_sale'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate an existing sale' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sale ID to duplicate' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, decorators_1.Permissions)('pos_refund_sale'),
    (0, swagger_1.ApiOperation)({ summary: 'Refund a sale (create return)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sale ID to refund' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RefundSaleDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "refund", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)('Sales'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map