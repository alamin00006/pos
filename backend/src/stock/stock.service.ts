import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { StockQueryDto } from './dto/stock-query.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery } from '../common/utils/pagination.util';
import { StockLedgerType, StockLedgerSource } from '@prisma/client';

/**
 * Coordinates Stock business logic, validation, and persistence workflows.
 */
@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  /**
   * Builds the requested Stock report from current business data.
   */
  async getStockReport(query: StockQueryDto, branchId?: string) {
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
        const stock = await this.calculateStock(product.id, branchId);
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

  /**
   * Handles the get low stock workflow for Stock records.
   */
  async getLowStock(query: StockQueryDto, branchId?: string) {
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
        const stock = await this.calculateStock(product.id, branchId);
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

  /**
   * Handles the get product ledger workflow for Stock records.
   */
  async getProductLedger(productId: string, query: StockQueryDto, branchId?: string) {
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
        where: { productId, ...(branchId ? { branchId } : {}) },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockLedger.count({ where: { productId, ...(branchId ? { branchId } : {}) } }),
    ]);

    // Calculate running balance
    let runningBalance = 0;
    const ledgerWithBalance = ledger.reverse().map((entry) => {
      const quantity = Math.abs(entry.quantity);
      if (entry.type === StockLedgerType.OUT) runningBalance -= quantity;
      else runningBalance += quantity;
      return { ...entry, balance: runningBalance };
    }).reverse();

    return paginate(ledgerWithBalance, total, page!, limit!);
  }

  /**
   * Handles the adjust stock workflow for Stock records.
   */
  async adjustStock(adjustStockDto: AdjustStockDto, branchId?: string) {
    const { productId, quantity, type, note } = adjustStockDto;

    const product = await this.prisma.product.findFirst({
      where: { id: productId, ...this.prisma.notDeleted() },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.stockLedger.create({
      data: {
        productId,
        type: type === 'IN' ? StockLedgerType.IN : StockLedgerType.OUT,
        source: StockLedgerSource.ADJUSTMENT,
        branchId,
        quantity,
        note,
      },
    });

    const newStock = await this.calculateStock(productId, branchId);
    return { message: 'Stock adjusted successfully', stock: newStock };
  }

  /**
   * Handles the set opening stock workflow for Stock records.
   */
  async setOpeningStock(productId: string, quantity: number, note?: string, branchId?: string) {
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
        branchId,
        quantity,
        note: note || 'Opening stock',
      },
    });

    return { message: 'Opening stock set successfully', stock: quantity };
  }

  // Used by other services
  /**
   * Creates a new Stock record after validating the request payload.
   */
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

  /**
   * Handles the deduct stock workflow for Stock records.
   */
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
        quantity,
        referenceId,
        note,
      },
    });
  }

  /**
   * Handles the calculate stock workflow for Stock records.
   */
  private async calculateStock(productId: string, branchId?: string): Promise<number> {
    const rows = await this.prisma.stockLedger.findMany({
      where: { productId, ...(branchId ? { branchId } : {}) },
      select: { type: true, quantity: true },
    });

    return rows.reduce((sum, row) => {
      const quantity = Math.abs(row.quantity);
      if (row.type === StockLedgerType.OUT) return sum - quantity;
      return sum + quantity;
    }, 0);
  }
}
