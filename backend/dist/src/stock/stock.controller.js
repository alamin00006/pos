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
exports.StockController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stock_service_1 = require("./stock.service");
const adjust_stock_dto_1 = require("./dto/adjust-stock.dto");
const stock_query_dto_1 = require("./dto/stock-query.dto");
const decorators_1 = require("../common/decorators");
let StockController = class StockController {
    constructor(stockService) {
        this.stockService = stockService;
    }
    async getStockReport(query) {
        return this.stockService.getStockReport(query);
    }
    async getLowStock(query) {
        return this.stockService.getLowStock(query);
    }
    async getProductLedger(productId, query) {
        return this.stockService.getProductLedger(productId, query);
    }
    async adjustStock(adjustStockDto) {
        return this.stockService.adjustStock(adjustStockDto);
    }
    async setOpeningStock(productId, quantity, note) {
        return this.stockService.setOpeningStock(productId, quantity, note);
    }
};
exports.StockController = StockController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock report for all products' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stock_query_dto_1.StockQueryDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getStockReport", null);
__decorate([
    (0, common_1.Get)('low'),
    (0, decorators_1.Permissions)('low_stock_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock products' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stock_query_dto_1.StockQueryDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)('ledger/:productId'),
    (0, decorators_1.Permissions)('stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock ledger for a product' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stock_query_dto_1.StockQueryDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getProductLedger", null);
__decorate([
    (0, common_1.Post)('adjust'),
    (0, decorators_1.Permissions)('barcode_add_stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually adjust stock' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [adjust_stock_dto_1.AdjustStockDto]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Post)('opening/:productId'),
    (0, decorators_1.Permissions)('barcode_add_stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Set opening stock for a product' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)('quantity')),
    __param(2, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], StockController.prototype, "setOpeningStock", null);
exports.StockController = StockController = __decorate([
    (0, swagger_1.ApiTags)('Stock'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('stock'),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockController);
//# sourceMappingURL=stock.controller.js.map