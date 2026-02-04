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
exports.BankAccountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bank_accounts_service_1 = require("./bank-accounts.service");
const decorators_1 = require("../common/decorators");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const dto_1 = require("./dto");
let BankAccountsController = class BankAccountsController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    deposit(id, dto) {
        return this.service.deposit(id, dto);
    }
    withdraw(id, dto) {
        return this.service.withdraw(id, dto);
    }
    transfer(id, dto) {
        return this.service.transfer(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.BankAccountsController = BankAccountsController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_bank_account'),
    (0, swagger_1.ApiOperation)({ summary: 'Create bank account' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBankAccountDto]),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('bank_account_list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bank accounts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('bank_account_list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bank account by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Permissions)('add_bank_account'),
    (0, swagger_1.ApiOperation)({ summary: 'Update bank account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateBankAccountDto]),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/deposit'),
    (0, decorators_1.Permissions)('create_bank_deposit'),
    (0, swagger_1.ApiOperation)({ summary: 'Deposit to bank account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.DepositDto]),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)(':id/withdraw'),
    (0, decorators_1.Permissions)('bank_account_withdraw'),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw from bank account' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.WithdrawDto]),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Post)(':id/transfer'),
    (0, decorators_1.Permissions)('bank_account_transfer'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer between bank accounts' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.TransferDto]),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "transfer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Permissions)('bank_account_delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete bank account' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "remove", null);
exports.BankAccountsController = BankAccountsController = __decorate([
    (0, swagger_1.ApiTags)('Bank Accounts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('bank-accounts'),
    __metadata("design:paramtypes", [bank_accounts_service_1.BankAccountsService])
], BankAccountsController);
//# sourceMappingURL=bank-accounts.controller.js.map