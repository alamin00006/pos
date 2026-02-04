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
exports.CashBookModule = exports.CashBookController = exports.BackupModule = exports.BackupController = exports.SettingsModule = exports.SettingsController = exports.ReportsModule = exports.ReportsController = exports.EstimatesModule = exports.EstimatesController = exports.AssetsModule = exports.AssetsController = exports.SalaryModule = exports.SalaryController = exports.EmployeesModule = exports.EmployeesController = exports.DamagesModule = exports.DamagesController = exports.PaymentsModule = exports.PaymentsController = exports.ExpensesModule = exports.ExpensesController = exports.ExpenseCategoriesModule = exports.ExpenseCategoriesController = exports.ReturnsModule = exports.ReturnsController = exports.SalesModule = exports.SalesController = exports.PurchasesModule = exports.PurchasesController = exports.BankAccountsModule = exports.BankAccountsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let BankAccountsController = class BankAccountsController {
    findAll() { return { message: 'Implement bank accounts CRUD' }; }
};
exports.BankAccountsController = BankAccountsController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BankAccountsController.prototype, "findAll", null);
exports.BankAccountsController = BankAccountsController = __decorate([
    (0, swagger_1.ApiTags)('Bank Accounts'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('bank-accounts')
], BankAccountsController);
let BankAccountsModule = class BankAccountsModule {
};
exports.BankAccountsModule = BankAccountsModule;
exports.BankAccountsModule = BankAccountsModule = __decorate([
    (0, common_1.Module)({ controllers: [BankAccountsController] })
], BankAccountsModule);
let PurchasesController = class PurchasesController {
    findAll() { return { message: 'Implement purchases CRUD' }; }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "findAll", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, swagger_1.ApiTags)('Purchases'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('purchases')
], PurchasesController);
let PurchasesModule = class PurchasesModule {
};
exports.PurchasesModule = PurchasesModule;
exports.PurchasesModule = PurchasesModule = __decorate([
    (0, common_1.Module)({ controllers: [PurchasesController] })
], PurchasesModule);
let SalesController = class SalesController {
    findAll() { return { message: 'Implement sales/POS CRUD' }; }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAll", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)('Sales'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('sales')
], SalesController);
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({ controllers: [SalesController] })
], SalesModule);
let ReturnsController = class ReturnsController {
    findAll() { return { message: 'Implement returns CRUD' }; }
};
exports.ReturnsController = ReturnsController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReturnsController.prototype, "findAll", null);
exports.ReturnsController = ReturnsController = __decorate([
    (0, swagger_1.ApiTags)('Returns'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('returns')
], ReturnsController);
let ReturnsModule = class ReturnsModule {
};
exports.ReturnsModule = ReturnsModule;
exports.ReturnsModule = ReturnsModule = __decorate([
    (0, common_1.Module)({ controllers: [ReturnsController] })
], ReturnsModule);
let ExpenseCategoriesController = class ExpenseCategoriesController {
    findAll() { return { message: 'Implement expense categories CRUD' }; }
};
exports.ExpenseCategoriesController = ExpenseCategoriesController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpenseCategoriesController.prototype, "findAll", null);
exports.ExpenseCategoriesController = ExpenseCategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Expense Categories'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('expense-categories')
], ExpenseCategoriesController);
let ExpenseCategoriesModule = class ExpenseCategoriesModule {
};
exports.ExpenseCategoriesModule = ExpenseCategoriesModule;
exports.ExpenseCategoriesModule = ExpenseCategoriesModule = __decorate([
    (0, common_1.Module)({ controllers: [ExpenseCategoriesController] })
], ExpenseCategoriesModule);
let ExpensesController = class ExpensesController {
    findAll() { return { message: 'Implement expenses CRUD' }; }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAll", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, swagger_1.ApiTags)('Expenses'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('expenses')
], ExpensesController);
let ExpensesModule = class ExpensesModule {
};
exports.ExpensesModule = ExpensesModule;
exports.ExpensesModule = ExpensesModule = __decorate([
    (0, common_1.Module)({ controllers: [ExpensesController] })
], ExpensesModule);
let PaymentsController = class PaymentsController {
    findAll() { return { message: 'Implement payments CRUD' }; }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('payments')
], PaymentsController);
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({ controllers: [PaymentsController] })
], PaymentsModule);
let DamagesController = class DamagesController {
    findAll() { return { message: 'Implement damages CRUD' }; }
};
exports.DamagesController = DamagesController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DamagesController.prototype, "findAll", null);
exports.DamagesController = DamagesController = __decorate([
    (0, swagger_1.ApiTags)('Damages'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('damages')
], DamagesController);
let DamagesModule = class DamagesModule {
};
exports.DamagesModule = DamagesModule;
exports.DamagesModule = DamagesModule = __decorate([
    (0, common_1.Module)({ controllers: [DamagesController] })
], DamagesModule);
let EmployeesController = class EmployeesController {
    findAll() { return { message: 'Implement employees CRUD' }; }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findAll", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('Employees'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('employees')
], EmployeesController);
let EmployeesModule = class EmployeesModule {
};
exports.EmployeesModule = EmployeesModule;
exports.EmployeesModule = EmployeesModule = __decorate([
    (0, common_1.Module)({ controllers: [EmployeesController] })
], EmployeesModule);
let SalaryController = class SalaryController {
    findAll() { return { message: 'Implement salary CRUD' }; }
};
exports.SalaryController = SalaryController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SalaryController.prototype, "findAll", null);
exports.SalaryController = SalaryController = __decorate([
    (0, swagger_1.ApiTags)('Salary'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('salary')
], SalaryController);
let SalaryModule = class SalaryModule {
};
exports.SalaryModule = SalaryModule;
exports.SalaryModule = SalaryModule = __decorate([
    (0, common_1.Module)({ controllers: [SalaryController] })
], SalaryModule);
let AssetsController = class AssetsController {
    findAll() { return { message: 'Implement assets CRUD' }; }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "findAll", null);
exports.AssetsController = AssetsController = __decorate([
    (0, swagger_1.ApiTags)('Assets'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('assets')
], AssetsController);
let AssetsModule = class AssetsModule {
};
exports.AssetsModule = AssetsModule;
exports.AssetsModule = AssetsModule = __decorate([
    (0, common_1.Module)({ controllers: [AssetsController] })
], AssetsModule);
let EstimatesController = class EstimatesController {
    findAll() { return { message: 'Implement estimates CRUD' }; }
};
exports.EstimatesController = EstimatesController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EstimatesController.prototype, "findAll", null);
exports.EstimatesController = EstimatesController = __decorate([
    (0, swagger_1.ApiTags)('Estimates'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('estimates')
], EstimatesController);
let EstimatesModule = class EstimatesModule {
};
exports.EstimatesModule = EstimatesModule;
exports.EstimatesModule = EstimatesModule = __decorate([
    (0, common_1.Module)({ controllers: [EstimatesController] })
], EstimatesModule);
let ReportsController = class ReportsController {
    findAll() { return { message: 'Implement reports endpoints' }; }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAll", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('reports')
], ReportsController);
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({ controllers: [ReportsController] })
], ReportsModule);
let SettingsController = class SettingsController {
    findAll() { return { message: 'Implement settings CRUD' }; }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "findAll", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('Settings'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('settings')
], SettingsController);
let SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule;
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({ controllers: [SettingsController] })
], SettingsModule);
let BackupController = class BackupController {
    getBackupInfo() { return { message: 'Use pg_dump for database backup' }; }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BackupController.prototype, "getBackupInfo", null);
exports.BackupController = BackupController = __decorate([
    (0, swagger_1.ApiTags)('Backup'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('backup')
], BackupController);
let BackupModule = class BackupModule {
};
exports.BackupModule = BackupModule;
exports.BackupModule = BackupModule = __decorate([
    (0, common_1.Module)({ controllers: [BackupController] })
], BackupModule);
let CashBookController = class CashBookController {
    findAll() { return { message: 'Implement cash book CRUD' }; }
};
exports.CashBookController = CashBookController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CashBookController.prototype, "findAll", null);
exports.CashBookController = CashBookController = __decorate([
    (0, swagger_1.ApiTags)('Cash Book'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_2.Controller)('cash-book')
], CashBookController);
let CashBookModule = class CashBookModule {
};
exports.CashBookModule = CashBookModule;
exports.CashBookModule = CashBookModule = __decorate([
    (0, common_1.Module)({ controllers: [CashBookController] })
], CashBookModule);
//# sourceMappingURL=stub-modules.js.map