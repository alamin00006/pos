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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const report_query_dto_1 = require("./dto/report-query.dto");
const decorators_1 = require("../common/decorators");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getTodayReport() {
        return this.reportsService.getTodayReport();
    }
    getDailyReport(query) {
        return this.reportsService.getDailyReport(query);
    }
    getCurrentMonthReport() {
        return this.reportsService.getCurrentMonthReport();
    }
    getProfitLossReport(query) {
        return this.reportsService.getProfitLossReport(query);
    }
    getTopProductsReport(query) {
        return this.reportsService.getTopProductsReport(query);
    }
    getTopCustomersReport(query) {
        return this.reportsService.getTopCustomersReport(query);
    }
    getCategoryWiseReport(query) {
        return this.reportsService.getCategoryWiseReport(query);
    }
    getSalesReport(query) {
        return this.reportsService.getSalesReport(query);
    }
    getPurchaseReport(query) {
        return this.reportsService.getPurchaseReport(query);
    }
    getCustomerDueReport(query) {
        return this.reportsService.getCustomerDueReport(query);
    }
    getSupplierDueReport(query) {
        return this.reportsService.getSupplierDueReport(query);
    }
    getLowStockReport() {
        return this.reportsService.getLowStockReport();
    }
    getSummaryReport() {
        return this.reportsService.getSummaryReport();
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('today'),
    (0, decorators_1.Permissions)('daily_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today\'s report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getTodayReport", null);
__decorate([
    (0, common_1.Get)('daily'),
    (0, decorators_1.Permissions)('daily_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily report with date range' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDailyReport", null);
__decorate([
    (0, common_1.Get)('current-month'),
    (0, decorators_1.Permissions)('current_month_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current month report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCurrentMonthReport", null);
__decorate([
    (0, common_1.Get)('profit-loss'),
    (0, decorators_1.Permissions)('profit_loss_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profit/loss report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getProfitLossReport", null);
__decorate([
    (0, common_1.Get)('top-products'),
    (0, decorators_1.Permissions)('top_product_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top selling products report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.TopItemsQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getTopProductsReport", null);
__decorate([
    (0, common_1.Get)('top-customers'),
    (0, decorators_1.Permissions)('top_customer_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top customers report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.TopItemsQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getTopCustomersReport", null);
__decorate([
    (0, common_1.Get)('category-wise'),
    (0, decorators_1.Permissions)('category_wise_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category-wise sales/purchase report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.CategoryReportQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCategoryWiseReport", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, decorators_1.Permissions)('sales_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)('purchases'),
    (0, decorators_1.Permissions)('purchase_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchases report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getPurchaseReport", null);
__decorate([
    (0, common_1.Get)('customer-due'),
    (0, decorators_1.Permissions)('customer_due_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer due report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.CustomerReportQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCustomerDueReport", null);
__decorate([
    (0, common_1.Get)('supplier-due'),
    (0, decorators_1.Permissions)('supplier_due_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier due report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.SupplierReportQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSupplierDueReport", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, decorators_1.Permissions)('low_stock_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getLowStockReport", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, decorators_1.Permissions)('summary_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall summary report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSummaryReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map