import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { StockQueryDto } from './dto/stock-query.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery } from '../common/utils/pagination.util';
import { StockLedgerType, StockLedgerSource } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStockReport(query: StockQueryDto) {
    const { page, limit, search, sortBy, sortOrder, categoryId } = query;
    const { skip, take } = buildPaginationQuery(page, limit);

    const where: any = {
      ...this.prisma.notDeleted(),
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { productCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: buildOrderByQuery(sortBy, sortOrder),
        include: {
          category: { select: { id: true, name: true } },
          unit: { select: { id: true, name: true, shortName: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calculate stock for each product
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stock = await this.calculateStock(product.id);
        const stockValue = Number(product.costPrice) * stock;
        return {
          ...product,
          stock,
          stockValue,
          isLowStock: stock <= product.alertQuantity,
        };
      }),
    );

    return paginate(productsWithStock, total, page!, limit!);
  }

  async getLowStock(query: StockQueryDto) {
    const { page, limit } = query;
    const { skip, take } = buildPaginationQuery(page, limit);

    // Get all products with their stock
    const products = await this.prisma.product.findMany({
      where: this.prisma.notDeleted(),
      include: {
        category: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true, shortName: true } },
      },
    });

    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stock = await this.calculateStock(product.id);
        return { ...product, stock };
      }),
    );

    // Filter low stock
    const lowStockProducts = productsWithStock.filter(
      (p) => p.stock <= p.alertQuantity,
    );

    const paginatedProducts = lowStockProducts.slice(skip, skip + take);

    return paginate(paginatedProducts, lowStockProducts.length, page!, limit!);
  }

  async getProductLedger(productId: string, query: StockQueryDto) {
    const { page, limit } = query;
    const { skip, take } = buildPaginationQuery(page, limit);

    const product = await this.prisma.product.findFirst({
      where: { id: productId, ...this.prisma.notDeleted() },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const [ledger, total] = await Promise.all([
      this.prisma.stockLedger.findMany({
        where: { productId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockLedger.count({ where: { productId } }),
    ]);

    // Calculate running balance
    let runningBalance = 0;
    const ledgerWithBalance = ledger.reverse().map((entry) => {
      runningBalance += entry.quantity;
      return { ...entry, balance: runningBalance };
    }).reverse();

    return paginate(ledgerWithBalance, total, page!, limit!);
  }

  async adjustStock(adjustStockDto: AdjustStockDto) {
    const { productId, quantity, type, note } = adjustStockDto;

    const product = await this.prisma.product.findFirst({
      where: { id: productId, ...this.prisma.notDeleted() },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const adjustedQuantity = type === 'IN' ? quantity : -quantity;

    await this.prisma.stockLedger.create({
      data: {
        productId,
        type: type === 'IN' ? StockLedgerType.IN : StockLedgerType.OUT,
        source: StockLedgerSource.ADJUSTMENT,
        quantity: adjustedQuantity,
        note,
      },
    });

    const newStock = await this.calculateStock(productId);
    return { message: 'Stock adjusted successfully', stock: newStock };
  }

  async setOpeningStock(productId: string, quantity: number, note?: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, ...this.prisma.notDeleted() },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.stockLedger.create({
      data: {
        productId,
        type: StockLedgerType.IN,
        source: StockLedgerSource.OPENING,
        quantity,
        note: note || 'Opening stock',
      },
    });

    return { message: 'Opening stock set successfully', stock: quantity };
  }

  // Used by other services
  async addStock(
    productId: string,
    quantity: number,
    source: StockLedgerSource,
    referenceId?: string,
    note?: string,
  ) {
    return this.prisma.stockLedger.create({
      data: {
        productId,
        type: StockLedgerType.IN,
        source,
        quantity,
        referenceId,
        note,
      },
    });
  }

  async deductStock(
    productId: string,
    quantity: number,
    source: StockLedgerSource,
    referenceId?: string,
    note?: string,
  ) {
    return this.prisma.stockLedger.create({
      data: {
        productId,
        type: StockLedgerType.OUT,
        source,
        quantity: -quantity,
        referenceId,
        note,
      },
    });
  }

  private async calculateStock(productId: string): Promise<number> {
    const result = await this.prisma.stockLedger.aggregate({
      where: { productId },
      _sum: { quantity: true },
    });
    return result._sum.quantity || 0;
  }
}
