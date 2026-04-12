import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateRangeQueryDto, TopItemsQueryDto, CategoryReportQueryDto, CustomerReportQueryDto, SupplierReportQueryDto } from './dto/report-query.dto';
import { SaleStatus, PurchaseStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(query: DateRangeQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;
    if (endDate) endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
  }

  private getTodayRange() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { startDate: today, endDate: tomorrow };
  }

  private getCurrentMonthRange() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { startDate, endDate };
  }

  // ==================== TODAY REPORT ====================
  async getTodayReport() {
    const { startDate, endDate } = this.getTodayRange();

    const [sales, purchases, expenses, returns] = await Promise.all([
      this.prisma.sale.aggregate({
        where: { saleDate: { gte: startDate, lt: endDate }, status: SaleStatus.COMPLETED, deletedAt: null },
        _sum: { total: true, paidAmount: true, dueAmount: true },
        _count: true,
      }),
      this.prisma.purchase.aggregate({
        where: { purchaseDate: { gte: startDate, lt: endDate }, status: PurchaseStatus.RECEIVED, deletedAt: null },
        _sum: { total: true, paidAmount: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: { expenseDate: { gte: startDate, lt: endDate }, deletedAt: null },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.return.aggregate({
        where: { returnDate: { gte: startDate, lt: endDate }, deletedAt: null },
        _sum: { total: true },
        _count: true,
      }),
    ]);

    const totalSales = Number(sales._sum.total || 0);
    const totalPurchases = Number(purchases._sum.total || 0);
    const totalExpenses = Number(expenses._sum.amount || 0);
    const totalReturns = Number(returns._sum.total || 0);
    const costOfGoodsSold = await this.getCostOfGoodsSold(startDate, endDate);
    const profit = totalSales - costOfGoodsSold - totalExpenses - totalReturns;

    return {
      date: startDate.toISOString().split('T')[0],
      sales: {
        total: totalSales,
        received: Number(sales._sum.paidAmount || 0),
        due: Number(sales._sum.dueAmount || 0),
        count: sales._count,
      },
      purchases: {
        total: totalPurchases,
        paid: Number(purchases._sum.paidAmount || 0),
        count: purchases._count,
      },
      expenses: {
        total: totalExpenses,
        count: expenses._count,
      },
      returns: {
        total: totalReturns,
        count: returns._count,
      },
      profit,
      costOfGoodsSold,
    };
  }

  // ==================== DAILY REPORT ====================
  async getDailyReport(query: DateRangeQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);
    const where: any = { deletedAt: null };
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = startDate;
      if (endDate) where.saleDate.lte = endDate;
    }

    const sales = await this.prisma.sale.findMany({
      where: { ...where, status: SaleStatus.COMPLETED },
      include: { customer: true, saleItems: { include: { product: true } } },
      orderBy: { saleDate: 'desc' },
    });

    const purchases = await this.prisma.purchase.findMany({
      where: { ...where, purchaseDate: where.saleDate, status: PurchaseStatus.RECEIVED },
      include: { supplier: true },
      orderBy: { purchaseDate: 'desc' },
    });

    const expenses = await this.prisma.expense.findMany({
      where: { ...where, expenseDate: where.saleDate },
      include: { expenseCategory: true },
      orderBy: { expenseDate: 'desc' },
    });

    const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalPurchases = purchases.reduce((sum, p) => sum + Number(p.total), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const costOfGoodsSold = await this.getCostOfGoodsSold(startDate, endDate);

    return {
      summary: {
        totalSales,
        totalPurchases,
        totalExpenses,
        costOfGoodsSold,
        profit: totalSales - costOfGoodsSold - totalExpenses,
        salesCount: sales.length,
        purchasesCount: purchases.length,
        expensesCount: expenses.length,
      },
      sales,
      purchases,
      expenses,
    };
  }

  // ==================== CURRENT MONTH REPORT ====================
  async getCurrentMonthReport() {
    const { startDate, endDate } = this.getCurrentMonthRange();

    const [sales, purchases, expenses, returns, damages] = await Promise.all([
      this.prisma.sale.aggregate({
        where: { saleDate: { gte: startDate, lte: endDate }, status: SaleStatus.COMPLETED, deletedAt: null },
        _sum: { total: true, paidAmount: true, dueAmount: true, discount: true },
        _count: true,
      }),
      this.prisma.purchase.aggregate({
        where: { purchaseDate: { gte: startDate, lte: endDate }, status: PurchaseStatus.RECEIVED, deletedAt: null },
        _sum: { total: true, paidAmount: true, dueAmount: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: { expenseDate: { gte: startDate, lte: endDate }, deletedAt: null },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.return.aggregate({
        where: { returnDate: { gte: startDate, lte: endDate }, deletedAt: null },
        _sum: { total: true },
        _count: true,
      }),
      this.prisma.damage.aggregate({
        where: { damageDate: { gte: startDate, lte: endDate }, deletedAt: null },
        _sum: { total: true },
        _count: true,
      }),
    ]);

    const totalSales = Number(sales._sum.total || 0);
    const totalPurchases = Number(purchases._sum.total || 0);
    const totalExpenses = Number(expenses._sum.amount || 0);
    const totalReturns = Number(returns._sum.total || 0);
    const totalDamages = Number(damages._sum.total || 0);
    const costOfGoodsSold = await this.getCostOfGoodsSold(startDate, endDate);
    const profit = totalSales - costOfGoodsSold - totalExpenses - totalReturns - totalDamages;

    return {
      month: startDate.toISOString().slice(0, 7),
      sales: {
        total: totalSales,
        received: Number(sales._sum.paidAmount || 0),
        due: Number(sales._sum.dueAmount || 0),
        discount: Number(sales._sum.discount || 0),
        count: sales._count,
      },
      purchases: {
        total: totalPurchases,
        paid: Number(purchases._sum.paidAmount || 0),
        due: Number(purchases._sum.dueAmount || 0),
        count: purchases._count,
      },
      expenses: {
        total: totalExpenses,
        count: expenses._count,
      },
      returns: {
        total: totalReturns,
        count: returns._count,
      },
      damages: {
        total: totalDamages,
        count: damages._count,
      },
      costOfGoodsSold,
      profit,
    };
  }

  // ==================== PROFIT/LOSS REPORT ====================
  async getProfitLossReport(query: DateRangeQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const [salesData, soldItems, expenseData, returnData, damageData] = await Promise.all([
      this.prisma.sale.aggregate({
        where: { 
          ...(startDate || endDate ? { saleDate: dateFilter } : {}),
          status: SaleStatus.COMPLETED, 
          deletedAt: null 
        },
        _sum: { total: true, discount: true },
      }),
      this.prisma.saleItem.findMany({
        where: {
          sale: {
            ...(startDate || endDate ? { saleDate: dateFilter } : {}),
            status: SaleStatus.COMPLETED,
            deletedAt: null,
          },
        },
        include: { product: { select: { costPrice: true } } },
      }),
      this.prisma.expense.aggregate({
        where: { 
          ...(startDate || endDate ? { expenseDate: dateFilter } : {}),
          deletedAt: null 
        },
        _sum: { amount: true },
      }),
      this.prisma.return.aggregate({
        where: { 
          ...(startDate || endDate ? { returnDate: dateFilter } : {}),
          deletedAt: null 
        },
        _sum: { total: true },
      }),
      this.prisma.damage.aggregate({
        where: { 
          ...(startDate || endDate ? { damageDate: dateFilter } : {}),
          deletedAt: null 
        },
        _sum: { total: true },
      }),
    ]);

    const revenue = Number(salesData._sum.total || 0);
    const discounts = Number(salesData._sum.discount || 0);
    const costOfGoodsSold = soldItems.reduce(
      (sum, item) => sum + Number(item.product.costPrice) * item.quantity,
      0,
    );
    const expenses = Number(expenseData._sum.amount || 0);
    const returns = Number(returnData._sum.total || 0);
    const damages = Number(damageData._sum.total || 0);

    const grossProfit = revenue - costOfGoodsSold;
    const netProfit = grossProfit - expenses - returns - damages;

    return {
      period: { startDate: startDate?.toISOString(), endDate: endDate?.toISOString() },
      revenue: {
        totalSales: revenue,
        discountsGiven: discounts,
        netRevenue: revenue - discounts,
      },
      costs: {
        costOfGoodsSold,
        expenses,
        returns,
        damages,
        totalCosts: costOfGoodsSold + expenses + returns + damages,
      },
      profit: {
        grossProfit,
        netProfit,
        profitMargin: revenue > 0 ? ((netProfit / revenue) * 100).toFixed(2) : '0.00',
      },
    };
  }

  // ==================== TOP PRODUCTS REPORT ====================
  async getTopProductsReport(query: TopItemsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);
    const limit = query.limit || 10;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const topProducts = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          ...(startDate || endDate ? { saleDate: dateFilter } : {}),
          status: SaleStatus.COMPLETED,
          deletedAt: null,
        },
      },
      _sum: { quantity: true, total: true },
      _count: true,
      orderBy: { _sum: { total: 'desc' } },
      take: limit,
    });

    const productIds = topProducts.map(p => p.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true, brand: true },
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    return topProducts.map((item, index) => ({
      rank: index + 1,
      product: productMap.get(item.productId),
      quantitySold: item._sum.quantity,
      totalRevenue: Number(item._sum.total || 0),
      salesCount: item._count,
    }));
  }

  // ==================== TOP CUSTOMERS REPORT ====================
  async getTopCustomersReport(query: TopItemsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);
    const limit = query.limit || 10;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const topCustomers = await this.prisma.sale.groupBy({
      by: ['customerId'],
      where: {
        ...(startDate || endDate ? { saleDate: dateFilter } : {}),
        status: SaleStatus.COMPLETED,
        deletedAt: null,
        customerId: { not: null },
      },
      _sum: { total: true, paidAmount: true, dueAmount: true },
      _count: true,
      orderBy: { _sum: { total: 'desc' } },
      take: limit,
    });

    const customerIds = topCustomers.map(c => c.customerId).filter(Boolean) as string[];
    const customers = await this.prisma.customer.findMany({
      where: { id: { in: customerIds } },
    });

    const customerMap = new Map(customers.map(c => [c.id, c]));

    return topCustomers.map((item, index) => ({
      rank: index + 1,
      customer: customerMap.get(item.customerId!),
      totalPurchases: Number(item._sum.total || 0),
      totalPaid: Number(item._sum.paidAmount || 0),
      totalDue: Number(item._sum.dueAmount || 0),
      ordersCount: item._count,
    }));
  }

  // ==================== CATEGORY WISE REPORT ====================
  async getCategoryWiseReport(query: CategoryReportQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const categoryWhere: any = {};
    if (query.categoryId) categoryWhere.id = query.categoryId;

    const categories = await this.prisma.category.findMany({
      where: { ...categoryWhere, deletedAt: null },
      include: { products: { select: { id: true } } },
    });

    const results = await Promise.all(
      categories.map(async (category) => {
        const productIds = category.products.map(p => p.id);

        if (productIds.length === 0) {
          return {
            category: { id: category.id, name: category.name },
            salesData: { quantity: 0, revenue: 0, count: 0 },
            purchaseData: { quantity: 0, cost: 0, count: 0 },
          };
        }

        const [salesData, purchaseData] = await Promise.all([
          this.prisma.saleItem.aggregate({
            where: {
              productId: { in: productIds },
              sale: {
                ...(startDate || endDate ? { saleDate: dateFilter } : {}),
                status: SaleStatus.COMPLETED,
                deletedAt: null,
              },
            },
            _sum: { quantity: true, total: true },
            _count: true,
          }),
          this.prisma.purchaseItem.aggregate({
            where: {
              productId: { in: productIds },
              purchase: {
                ...(startDate || endDate ? { purchaseDate: dateFilter } : {}),
                status: PurchaseStatus.RECEIVED,
                deletedAt: null,
              },
            },
            _sum: { quantity: true, total: true },
            _count: true,
          }),
        ]);

        return {
          category: { id: category.id, name: category.name },
          salesData: {
            quantity: salesData._sum.quantity || 0,
            revenue: Number(salesData._sum.total || 0),
            count: salesData._count,
          },
          purchaseData: {
            quantity: purchaseData._sum.quantity || 0,
            cost: Number(purchaseData._sum.total || 0),
            count: purchaseData._count,
          },
        };
      }),
    );

    return results;
  }

  // ==================== SALES REPORT ====================
  async getSalesReport(query: DateRangeQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const [summary, salesByDay] = await Promise.all([
      this.prisma.sale.aggregate({
        where: {
          ...(startDate || endDate ? { saleDate: dateFilter } : {}),
          status: SaleStatus.COMPLETED,
          deletedAt: null,
        },
        _sum: { total: true, paidAmount: true, dueAmount: true, discount: true },
        _count: true,
        _avg: { total: true },
      }),
      this.prisma.$queryRaw`
        SELECT 
          DATE("saleDate") as date,
          COUNT(*) as count,
          SUM(total) as total,
          SUM("paidAmount") as paid,
          SUM("dueAmount") as due
        FROM "Sale"
        WHERE status = 'COMPLETED' 
          AND "deletedAt" IS NULL
          ${startDate ? this.prisma.$queryRaw`AND "saleDate" >= ${startDate}` : this.prisma.$queryRaw``}
          ${endDate ? this.prisma.$queryRaw`AND "saleDate" <= ${endDate}` : this.prisma.$queryRaw``}
        GROUP BY DATE("saleDate")
        ORDER BY date DESC
      ` as Promise<any[]>,
    ]);

    return {
      summary: {
        totalSales: Number(summary._sum.total || 0),
        totalReceived: Number(summary._sum.paidAmount || 0),
        totalDue: Number(summary._sum.dueAmount || 0),
        totalDiscount: Number(summary._sum.discount || 0),
        averageOrderValue: Number(summary._avg.total || 0),
        salesCount: summary._count,
      },
      dailyBreakdown: salesByDay,
    };
  }

  // ==================== PURCHASE REPORT ====================
  async getPurchaseReport(query: DateRangeQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const summary = await this.prisma.purchase.aggregate({
      where: {
        ...(startDate || endDate ? { purchaseDate: dateFilter } : {}),
        status: PurchaseStatus.RECEIVED,
        deletedAt: null,
      },
      _sum: { total: true, paidAmount: true, dueAmount: true },
      _count: true,
      _avg: { total: true },
    });

    const purchasesBySupplier = await this.prisma.purchase.groupBy({
      by: ['supplierId'],
      where: {
        ...(startDate || endDate ? { purchaseDate: dateFilter } : {}),
        status: PurchaseStatus.RECEIVED,
        deletedAt: null,
      },
      _sum: { total: true },
      _count: true,
    });

    const supplierIds = purchasesBySupplier.map(p => p.supplierId);
    const suppliers = await this.prisma.supplier.findMany({
      where: { id: { in: supplierIds } },
    });
    const supplierMap = new Map(suppliers.map(s => [s.id, s]));

    return {
      summary: {
        totalPurchases: Number(summary._sum.total || 0),
        totalPaid: Number(summary._sum.paidAmount || 0),
        totalDue: Number(summary._sum.dueAmount || 0),
        averageOrderValue: Number(summary._avg.total || 0),
        purchasesCount: summary._count,
      },
      bySupplier: purchasesBySupplier.map(item => ({
        supplier: supplierMap.get(item.supplierId),
        totalPurchases: Number(item._sum.total || 0),
        count: item._count,
      })),
    };
  }

  // ==================== CUSTOMER DUE REPORT ====================
  async getCustomerDueReport(query: CustomerReportQueryDto) {
    const where: any = { deletedAt: null };
    if (query.customerId) where.id = query.customerId;

    const customers = await this.prisma.customer.findMany({
      where,
      include: {
        sales: {
          where: { status: SaleStatus.COMPLETED, deletedAt: null, dueAmount: { gt: 0 } },
          select: { id: true, invoiceNo: true, total: true, dueAmount: true, saleDate: true },
        },
        _count: { select: { sales: true } },
      },
    });

    return customers
      .filter(c => c.sales.length > 0)
      .map(customer => ({
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
        totalDue: customer.sales.reduce((sum, s) => sum + Number(s.dueAmount), 0),
        pendingInvoices: customer.sales.length,
        invoices: customer.sales,
      }))
      .sort((a, b) => b.totalDue - a.totalDue);
  }

  // ==================== SUPPLIER DUE REPORT ====================
  async getSupplierDueReport(query: SupplierReportQueryDto) {
    const where: any = { deletedAt: null };
    if (query.supplierId) where.id = query.supplierId;

    const suppliers = await this.prisma.supplier.findMany({
      where,
      include: {
        purchases: {
          where: { status: PurchaseStatus.RECEIVED, deletedAt: null, dueAmount: { gt: 0 } },
          select: { id: true, invoiceNo: true, total: true, dueAmount: true, purchaseDate: true },
        },
      },
    });

    return suppliers
      .filter(s => s.purchases.length > 0)
      .map(supplier => ({
        supplier: {
          id: supplier.id,
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email,
        },
        totalDue: supplier.purchases.reduce((sum, p) => sum + Number(p.dueAmount), 0),
        pendingInvoices: supplier.purchases.length,
        invoices: supplier.purchases,
      }))
      .sort((a, b) => b.totalDue - a.totalDue);
  }

  // ==================== LOW STOCK REPORT ====================
  async getLowStockReport() {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
        brand: true,
        unit: true,
        stockLedger: { select: { type: true, quantity: true } },
      },
    });

    return products
      .map(product => {
        const stockIn = product.stockLedger
          .filter(s => s.type === 'IN')
          .reduce((sum, s) => sum + Math.abs(s.quantity), 0);
        const stockOut = product.stockLedger
          .filter(s => s.type === 'OUT')
          .reduce((sum, s) => sum + Math.abs(s.quantity), 0);
        const currentStock = stockIn - stockOut;

        return {
          product: {
            id: product.id,
            name: product.name,
            productCode: product.productCode,
            barcode: product.barcode,
            category: product.category?.name,
            brand: product.brand?.name,
            unit: product.unit?.name,
          },
          currentStock,
          alertQuantity: product.alertQuantity,
          isLowStock: currentStock <= product.alertQuantity,
        };
      })
      .filter(p => p.isLowStock)
      .sort((a, b) => a.currentStock - b.currentStock);
  }

  // ==================== SUMMARY REPORT ====================
  async getSummaryReport() {
    const [
      totalCustomers,
      totalSuppliers,
      totalProducts,
      totalSales,
      totalPurchases,
      totalExpenses,
      totalReturns,
    ] = await Promise.all([
      this.prisma.customer.count({ where: { deletedAt: null } }),
      this.prisma.supplier.count({ where: { deletedAt: null } }),
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.sale.aggregate({
        where: { status: SaleStatus.COMPLETED, deletedAt: null },
        _sum: { total: true, paidAmount: true, dueAmount: true },
        _count: true,
      }),
      this.prisma.purchase.aggregate({
        where: { status: PurchaseStatus.RECEIVED, deletedAt: null },
        _sum: { total: true, paidAmount: true, dueAmount: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: { deletedAt: null },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.return.aggregate({
        where: { deletedAt: null },
        _sum: { total: true },
        _count: true,
      }),
    ]);

    const totalRevenue = Number(totalSales._sum.total || 0);
    const costOfGoodsSold = await this.getCostOfGoodsSold();
    const totalCost = costOfGoodsSold + Number(totalExpenses._sum.amount || 0);
    const totalProfit = totalRevenue - totalCost - Number(totalReturns._sum.total || 0);

    return {
      entities: {
        customers: totalCustomers,
        suppliers: totalSuppliers,
        products: totalProducts,
      },
      sales: {
        total: Number(totalSales._sum.total || 0),
        received: Number(totalSales._sum.paidAmount || 0),
        due: Number(totalSales._sum.dueAmount || 0),
        count: totalSales._count,
      },
      purchases: {
        total: Number(totalPurchases._sum.total || 0),
        paid: Number(totalPurchases._sum.paidAmount || 0),
        due: Number(totalPurchases._sum.dueAmount || 0),
        count: totalPurchases._count,
      },
      expenses: {
        total: Number(totalExpenses._sum.amount || 0),
        count: totalExpenses._count,
      },
      returns: {
        total: Number(totalReturns._sum.total || 0),
        count: totalReturns._count,
      },
      financial: {
        totalRevenue,
        costOfGoodsSold,
        totalCost,
        totalProfit,
      },
    };
  }

  private async getCostOfGoodsSold(startDate?: Date, endDate?: Date) {
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lt = endDate;

    const soldItems = await this.prisma.saleItem.findMany({
      where: {
        sale: {
          ...(startDate || endDate ? { saleDate: dateFilter } : {}),
          status: SaleStatus.COMPLETED,
          deletedAt: null,
        },
      },
      include: { product: { select: { costPrice: true } } },
    });

    return soldItems.reduce((sum, item) => sum + Number(item.product.costPrice) * item.quantity, 0);
  }
}
