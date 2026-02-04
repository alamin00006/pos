import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

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
}
