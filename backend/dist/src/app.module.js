"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const units_module_1 = require("./units/units.module");
const owners_module_1 = require("./owners/owners.module");
const bank_accounts_module_1 = require("./bank-accounts/bank-accounts.module");
const brands_module_1 = require("./brands/brands.module");
const categories_module_1 = require("./categories/categories.module");
const subcategories_module_1 = require("./subcategories/subcategories.module");
const products_module_1 = require("./products/products.module");
const stock_module_1 = require("./stock/stock.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const customers_module_1 = require("./customers/customers.module");
const purchases_module_1 = require("./purchases/purchases.module");
const sales_module_1 = require("./sales/sales.module");
const returns_module_1 = require("./returns/returns.module");
const expense_categories_module_1 = require("./expense-categories/expense-categories.module");
const expenses_module_1 = require("./expenses/expenses.module");
const payments_module_1 = require("./payments/payments.module");
const damages_module_1 = require("./damages/damages.module");
const employees_module_1 = require("./employees/employees.module");
const salary_module_1 = require("./salary/salary.module");
const assets_module_1 = require("./assets/assets.module");
const estimates_module_1 = require("./estimates/estimates.module");
const reports_module_1 = require("./reports/reports.module");
const settings_module_1 = require("./settings/settings.module");
const backup_module_1 = require("./backup/backup.module");
const cash_book_module_1 = require("./cash-book/cash-book.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const permissions_guard_1 = require("./common/guards/permissions.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: parseInt(process.env.THROTTLE_TTL || '60000'),
                    limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
                }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            units_module_1.UnitsModule,
            owners_module_1.OwnersModule,
            bank_accounts_module_1.BankAccountsModule,
            brands_module_1.BrandsModule,
            categories_module_1.CategoriesModule,
            subcategories_module_1.SubcategoriesModule,
            products_module_1.ProductsModule,
            stock_module_1.StockModule,
            suppliers_module_1.SuppliersModule,
            customers_module_1.CustomersModule,
            purchases_module_1.PurchasesModule,
            sales_module_1.SalesModule,
            returns_module_1.ReturnsModule,
            expense_categories_module_1.ExpenseCategoriesModule,
            expenses_module_1.ExpensesModule,
            payments_module_1.PaymentsModule,
            damages_module_1.DamagesModule,
            employees_module_1.EmployeesModule,
            salary_module_1.SalaryModule,
            assets_module_1.AssetsModule,
            estimates_module_1.EstimatesModule,
            reports_module_1.ReportsModule,
            settings_module_1.SettingsModule,
            backup_module_1.BackupModule,
            cash_book_module_1.CashBookModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permissions_guard_1.PermissionsGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map