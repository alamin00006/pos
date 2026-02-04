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
exports.PurchasesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const purchases_service_1 = require("./purchases.service");
const dto_1 = require("./dto");
const decorators_1 = require("../common/decorators");
let PurchasesController = class PurchasesController {
    constructor(purchasesService) {
        this.purchasesService = purchasesService;
    }
    create(dto, user) {
        return this.purchasesService.create(dto, user?.id);
    }
    findAll(query) {
        return this.purchasesService.findAll(query);
    }
    findOne(id) {
        return this.purchasesService.findOne(id);
    }
    getReceipt(id) {
        return this.purchasesService.getReceipt(id);
    }
    update(id, dto) {
        return this.purchasesService.update(id, dto);
    }
    addPayment(id, dto) {
        return this.purchasesService.addPayment(id, dto);
    }
    remove(id) {
        return this.purchasesService.remove(id);
    }
    getSupplierPurchases(supplierId, query) {
        return this.purchasesService.getSupplierPurchases(supplierId, query);
    }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('create_purchase'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new purchase' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePurchaseDto, Object]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('view_purchase'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all purchases with pagination and filters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PurchaseQueryDto]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('view_purchase'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a purchase by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/receipt'),
    (0, decorators_1.Permissions)('purchase_receipt'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchase receipt' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "getReceipt", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Permissions)('edit_purchase'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a purchase' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdatePurchaseDto]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/payments'),
    (0, decorators_1.Permissions)('purchase_add_payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Add payment to a purchase' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AddPurchasePaymentDto]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "addPayment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Permissions)('delete_purchase'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a purchase (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('supplier/:supplierId'),
    (0, decorators_1.Permissions)('view_purchase'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchases by supplier' }),
    __param(0, (0, common_1.Param)('supplierId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.PurchaseQueryDto]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "getSupplierPurchases", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, swagger_1.ApiTags)('Purchases'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('purchases'),
    __metadata("design:paramtypes", [purchases_service_1.PurchasesService])
], PurchasesController);
//# sourceMappingURL=purchases.controller.js.map