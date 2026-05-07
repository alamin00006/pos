import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Coordinates Backup business logic, validation, and persistence workflows.
 */
@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

  /**
   * Handles the get backup info workflow for Backup records.
   */
  async getBackupInfo() {
    const [
      usersCount, customersCount, suppliersCount, productsCount,
      salesCount, purchasesCount, expensesCount
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.customer.count({ where: { deletedAt: null } }),
      this.prisma.supplier.count({ where: { deletedAt: null } }),
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.sale.count({ where: { deletedAt: null } }),
      this.prisma.purchase.count({ where: { deletedAt: null } }),
      this.prisma.expense.count({ where: { deletedAt: null } }),
    ]);

    return {
      message: 'Database backup information',
      instructions: [
        'To create a database backup, run: pg_dump -U <username> -d <database> > backup.sql',
        'To restore from backup, run: psql -U <username> -d <database> < backup.sql',
        'Ensure you have proper database credentials and access rights.',
      ],
      statistics: {
        users: usersCount,
        customers: customersCount,
        suppliers: suppliersCount,
        products: productsCount,
        sales: salesCount,
        purchases: purchasesCount,
        expenses: expensesCount,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handles the export data workflow for Backup records.
   */
  async exportData() {
    const [
      users,
      roles,
      permissions,
      owners,
      units,
      brands,
      categories,
      subcategories,
      products,
      stockLedger,
      suppliers,
      supplierLedger,
      supplierPayments,
      customers,
      customerLedger,
      customerPayments,
      purchases,
      purchaseItems,
      sales,
      saleItems,
      returns,
      returnItems,
      estimates,
      estimateItems,
      damages,
      damageItems,
      expenseCategories,
      expenses,
      payments,
      bankAccounts,
      bankTransactions,
      employees,
      salaryPayments,
      assets,
      cashBook,
      settings,
    ] = await Promise.all([
      this.prisma.user.findMany(),
      this.prisma.role.findMany(),
      this.prisma.permission.findMany(),
      this.prisma.owner.findMany(),
      this.prisma.unit.findMany({ include: { conversion: true } }),
      this.prisma.brand.findMany(),
      this.prisma.category.findMany(),
      this.prisma.subcategory.findMany(),
      this.prisma.product.findMany(),
      this.prisma.stockLedger.findMany(),
      this.prisma.supplier.findMany(),
      this.prisma.supplierLedger.findMany(),
      this.prisma.supplierPayment.findMany(),
      this.prisma.customer.findMany(),
      this.prisma.customerLedger.findMany(),
      this.prisma.customerPayment.findMany(),
      this.prisma.purchase.findMany(),
      this.prisma.purchaseItem.findMany(),
      this.prisma.sale.findMany(),
      this.prisma.saleItem.findMany(),
      this.prisma.return.findMany(),
      this.prisma.returnItem.findMany(),
      this.prisma.estimate.findMany(),
      this.prisma.estimateItem.findMany(),
      this.prisma.damage.findMany(),
      this.prisma.damageItem.findMany(),
      this.prisma.expenseCategory.findMany(),
      this.prisma.expense.findMany(),
      this.prisma.payment.findMany(),
      this.prisma.bankAccount.findMany(),
      this.prisma.bankTransaction.findMany(),
      this.prisma.employee.findMany(),
      this.prisma.salaryPayment.findMany(),
      this.prisma.asset.findMany(),
      this.prisma.cashBook.findMany(),
      this.prisma.setting.findMany(),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      formatVersion: 1,
      data: {
        users,
        roles,
        permissions,
        owners,
        units,
        brands,
        categories,
        subcategories,
        products,
        stockLedger,
        suppliers,
        supplierLedger,
        supplierPayments,
        customers,
        customerLedger,
        customerPayments,
        purchases,
        purchaseItems,
        sales,
        saleItems,
        returns,
        returnItems,
        estimates,
        estimateItems,
        damages,
        damageItems,
        expenseCategories,
        expenses,
        payments,
        bankAccounts,
        bankTransactions,
        employees,
        salaryPayments,
        assets,
        cashBook,
        settings,
      },
    };
  }
}
