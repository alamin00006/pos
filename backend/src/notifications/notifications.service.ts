import { Injectable } from '@nestjs/common';
import { PurchaseStatus, SaleStatus, StockLedgerType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type NotificationType = 'info' | 'success' | 'warning' | 'danger';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications() {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const tomorrow = new Date(startOfToday);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [lowStock, customerDue, supplierDue, todaySales, pendingPurchases] =
      await Promise.all([
        this.getLowStockNotifications(),
        this.getCustomerDueNotification(),
        this.getSupplierDueNotification(),
        this.prisma.sale.aggregate({
          where: {
            saleDate: { gte: startOfToday, lt: tomorrow },
            status: SaleStatus.COMPLETED,
            deletedAt: null,
          },
          _sum: { total: true },
          _count: true,
        }),
        this.prisma.purchase.count({
          where: { status: PurchaseStatus.PENDING, deletedAt: null },
        }),
      ]);

    const notifications = [
      ...lowStock,
      customerDue,
      supplierDue,
      {
        id: 'today-sales',
        type: 'success' as NotificationType,
        title: 'Today sales',
        message: `${todaySales._count} sale(s) completed, total Tk ${Number(
          todaySales._sum.total || 0,
        ).toLocaleString('en-US')}.`,
        createdAt: now.toISOString(),
      },
      pendingPurchases > 0
        ? {
            id: 'pending-purchases',
            type: 'warning' as NotificationType,
            title: 'Pending purchases',
            message: `${pendingPurchases} purchase order(s) are still pending.`,
            createdAt: now.toISOString(),
          }
        : null,
    ].filter(Boolean);

    return {
      unreadCount: notifications.length,
      notifications,
    };
  }

  private async getLowStockNotifications() {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        stockLedger: { select: { type: true, quantity: true } },
      },
    });

    return products
      .map((product) => {
        const stock = product.stockLedger.reduce((sum, row) => {
          const quantity = Math.abs(row.quantity);
          return row.type === StockLedgerType.OUT
            ? sum - quantity
            : sum + quantity;
        }, 0);

        return {
          product,
          stock,
          isLowStock: stock <= product.alertQuantity,
        };
      })
      .filter((item) => item.isLowStock)
      .slice(0, 3)
      .map((item) => ({
        id: `low-stock-${item.product.id}`,
        type: 'warning' as NotificationType,
        title: 'Low stock alert',
        message: `${item.product.name} has ${item.stock} item(s) in stock.`,
        createdAt: item.product.updatedAt.toISOString(),
        href: '/stock',
      }));
  }

  private async getCustomerDueNotification() {
    const result = await this.prisma.sale.aggregate({
      where: {
        status: SaleStatus.COMPLETED,
        dueAmount: { gt: 0 },
        deletedAt: null,
      },
      _sum: { dueAmount: true },
      _count: true,
    });

    return {
      id: 'customer-due',
      type: Number(result._sum.dueAmount || 0) > 0 ? 'danger' : 'info',
      title: 'Customer due',
      message: `${result._count} invoice(s), Tk ${Number(
        result._sum.dueAmount || 0,
      ).toLocaleString('en-US')} receivable.`,
      createdAt: new Date().toISOString(),
      href: '/reports/customer-due',
    };
  }

  private async getSupplierDueNotification() {
    const result = await this.prisma.purchase.aggregate({
      where: {
        status: PurchaseStatus.RECEIVED,
        dueAmount: { gt: 0 },
        deletedAt: null,
      },
      _sum: { dueAmount: true },
      _count: true,
    });

    return {
      id: 'supplier-due',
      type: Number(result._sum.dueAmount || 0) > 0 ? 'warning' : 'info',
      title: 'Supplier due',
      message: `${result._count} purchase(s), Tk ${Number(
        result._sum.dueAmount || 0,
      ).toLocaleString('en-US')} payable.`,
      createdAt: new Date().toISOString(),
      href: '/reports/supplier-due',
    };
  }
}
