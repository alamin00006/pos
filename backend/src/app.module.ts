import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { UnitsModule } from "./units/units.module";
import { OwnersModule } from "./owners/owners.module";
import { BankAccountsModule } from "./bank-accounts/bank-accounts.module";
import { BrandsModule } from "./brands/brands.module";
import { CategoriesModule } from "./categories/categories.module";
import { SubcategoriesModule } from "./subcategories/subcategories.module";
import { ProductsModule } from "./products/products.module";
import { StockModule } from "./stock/stock.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { CustomersModule } from "./customers/customers.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { SalesModule } from "./sales/sales.module";
import { ReturnsModule } from "./returns/returns.module";
import { ExpenseCategoriesModule } from "./expense-categories/expense-categories.module";
import { ExpensesModule } from "./expenses/expenses.module";
import { PaymentsModule } from "./payments/payments.module";
import { DamagesModule } from "./damages/damages.module";
import { EmployeesModule } from "./employees/employees.module";
import { SalaryModule } from "./salary/salary.module";
import { AssetsModule } from "./assets/assets.module";
import { EstimatesModule } from "./estimates/estimates.module";
import { ReportsModule } from "./reports/reports.module";
import { SettingsModule } from "./settings/settings.module";
import { BackupModule } from "./backup/backup.module";
import { CashBookModule } from "./cash-book/cash-book.module";
import { BranchesModule } from "./branches/branches.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { PermissionsGuard } from "./common/guards/permissions.guard";
import { BranchAccessGuard } from "./common/guards/branch-access.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || "60000"),
        limit: parseInt(process.env.THROTTLE_LIMIT || "100"),
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    UnitsModule,
    OwnersModule,
    BankAccountsModule,
    BrandsModule,
    CategoriesModule,
    SubcategoriesModule,
    ProductsModule,
    StockModule,
    SuppliersModule,
    CustomersModule,
    PurchasesModule,
    SalesModule,
    ReturnsModule,
    ExpenseCategoriesModule,
    ExpensesModule,
    PaymentsModule,
    DamagesModule,
    EmployeesModule,
    SalaryModule,
    AssetsModule,
    EstimatesModule,
    ReportsModule,
    SettingsModule,
    BackupModule,
    CashBookModule,
    BranchesModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: BranchAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
