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
exports.CashBookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cash_book_service_1 = require("./cash-book.service");
const decorators_1 = require("../common/decorators");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let CashBookController = class CashBookController {
    constructor(service) {
        this.service = service;
    }
    findAll(query) { return this.service.findAll(query); }
    getBalance() { return this.service.getBalance(); }
    getSummary(query) { return this.service.getSummary(query); }
};
exports.CashBookController = CashBookController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('cash_book'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cash book entries' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CashBookController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('balance'),
    (0, decorators_1.Permissions)('cash_book'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current cash balance' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CashBookController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, decorators_1.Permissions)('cash_book'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cash book summary' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashBookController.prototype, "getSummary", null);
exports.CashBookController = CashBookController = __decorate([
    (0, swagger_1.ApiTags)('Cash Book'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('cash-book'),
    __metadata("design:paramtypes", [cash_book_service_1.CashBookService])
], CashBookController);
//# sourceMappingURL=cash-book.controller.js.map