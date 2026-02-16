import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import {
  paginate,
  buildPaginationQuery,
  buildOrderByQuery,
} from "../common/utils/pagination.util";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      categoryId,
      subcategoryId,
      brandId,
    } = query;

    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);

    const where: any = {
      ...this.prisma.notDeleted(),
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { productCode: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId;
    if (brandId) where.brandId = brandId;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: { select: { id: true, name: true } },
          subcategory: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          unit: { select: { id: true, name: true, shortName: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const productIds = products.map((p) => p.id);
    const stockMap = await this.calculateStockForProducts(productIds);

    const productsWithStock = products.map((p) => ({
      ...p,
      stock: stockMap[p.id] ?? 0,
    }));

    return paginate(productsWithStock, total, page!, limit!);
  }

  async search(q: string) {
    if (!q || q.length < 2) return [];

    const products = await this.prisma.product.findMany({
      where: {
        ...this.prisma.notDeleted(),
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { productCode: { contains: q, mode: "insensitive" } },
          { barcode: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 20,
      include: {
        category: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true, shortName: true } },
      },
    });

    const ids = products.map((p) => p.id);
    const stockMap = await this.calculateStockForProducts(ids);

    return products.map((p) => ({
      ...p,
      stock: stockMap[p.id] ?? 0,
    }));
  }

  async findByBarcode(barcode: string) {
    const product = await this.prisma.product.findFirst({
      where: { barcode, ...this.prisma.notDeleted() },
      include: {
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true, shortName: true } },
      },
    });

    if (!product) throw new NotFoundException("Product not found");

    const stock = await this.calculateStock(product.id);

    return { ...product, stock };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, ...this.prisma.notDeleted() },
      include: {
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true, shortName: true } },
      },
    });

    if (!product) throw new NotFoundException("Product not found");

    const stock = await this.calculateStock(product.id);

    return { ...product, stock };
  }

  async getStock(id: string) {
    await this.findOne(id);
    const stock = await this.calculateStock(id);
    return { productId: id, stock };
  }

  // ✅ userId optional: pass from controller (req.user.id)
  async create(createProductDto: CreateProductDto, userId?: string) {
    const existingCode = await this.prisma.product.findUnique({
      where: { productCode: createProductDto.productCode },
    });
    if (existingCode)
      throw new ConflictException("Product code already exists");

    if (createProductDto.barcode) {
      const existingBarcode = await this.prisma.product.findUnique({
        where: { barcode: createProductDto.barcode },
      });
      if (existingBarcode)
        throw new ConflictException("Barcode already exists");
    }

    const openingStock = Math.max(0, createProductDto.openingStock ?? 0);

    // Don't pass openingStock to product table
    const { openingStock: _ignored, ...productData } = createProductDto as any;

    const created = await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: productData,
        include: {
          category: { select: { id: true, name: true } },
          subcategory: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          unit: { select: { id: true, name: true, shortName: true } },
        },
      });

      if (openingStock > 0) {
        await tx.stockLedger.create({
          data: {
            productId: product.id,
            type: "IN",
            source: "OPENING",
            quantity: openingStock,
            referenceId: product.id,
            note: "Opening stock",
            createdById: userId ?? null, // ✅ new
          },
        });
      }

      return product;
    });

    const stock = await this.calculateStock(created.id);
    return { ...created, stock };
  }

  // ✅ userId optional: pass from controller (req.user.id)
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId?: string,
  ) {
    const product = await this.findOne(id);

    if (
      updateProductDto.productCode &&
      updateProductDto.productCode !== product.productCode
    ) {
      const existing = await this.prisma.product.findUnique({
        where: { productCode: updateProductDto.productCode },
      });
      if (existing) throw new ConflictException("Product code already exists");
    }

    if (
      updateProductDto.barcode &&
      updateProductDto.barcode !== product.barcode
    ) {
      const existing = await this.prisma.product.findUnique({
        where: { barcode: updateProductDto.barcode },
      });
      if (existing) throw new ConflictException("Barcode already exists");
    }

    const openingStock =
      typeof (updateProductDto as any).openingStock === "number"
        ? Math.max(0, (updateProductDto as any).openingStock)
        : undefined;

    const { openingStock: _ignored, ...productData } = updateProductDto as any;

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: productData,
        include: {
          category: { select: { id: true, name: true } },
          subcategory: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          unit: { select: { id: true, name: true, shortName: true } },
        },
      });

      if (openingStock !== undefined) {
        await this.setOpeningStock(tx, id, openingStock, userId);
      }

      return updatedProduct;
    });

    const stock = await this.calculateStock(updated.id);
    return { ...updated, stock };
  }

  async updateSellPrice(id: string, sellPrice: number) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: { sellPrice } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.update({
      where: { id },
      data: this.prisma.softDelete(),
    });
    return { message: "Product deleted successfully" };
  }

  // ---------- Stock helpers ----------

  private async calculateStock(productId: string): Promise<number> {
    const rows = await this.prisma.stockLedger.findMany({
      where: { productId },
      select: { type: true, quantity: true },
    });

    return rows.reduce((sum, r) => {
      if (r.type === "IN") return sum + r.quantity;
      if (r.type === "OUT") return sum - r.quantity;
      return sum + r.quantity; // ADJUST signed delta
    }, 0);
  }

  private async calculateStockForProducts(productIds: string[]) {
    if (productIds.length === 0) return {} as Record<string, number>;

    const grouped = await this.prisma.stockLedger.groupBy({
      by: ["productId", "type"],
      where: { productId: { in: productIds } },
      _sum: { quantity: true },
    });

    const map: Record<string, number> = {};
    for (const row of grouped) {
      const qty = row._sum.quantity ?? 0;
      if (!map[row.productId]) map[row.productId] = 0;

      if (row.type === "IN") map[row.productId] += qty;
      else if (row.type === "OUT") map[row.productId] -= qty;
      else map[row.productId] += qty;
    }

    return map;
  }

  private async setOpeningStock(
    tx: Prisma.TransactionClient,
    productId: string,
    newQty: number,
    userId?: string,
  ) {
    const grouped = await tx.stockLedger.groupBy({
      by: ["type"],
      where: { productId, source: "OPENING" },
      _sum: { quantity: true },
    });

    let current = 0;
    for (const g of grouped) {
      const qty = g._sum.quantity ?? 0;
      if (g.type === "IN") current += qty;
      else if (g.type === "OUT") current -= qty;
      else current += qty;
    }

    const delta = newQty - current;
    if (delta === 0) return;

    if (delta > 0) {
      await tx.stockLedger.create({
        data: {
          productId,
          type: "IN",
          source: "OPENING",
          quantity: delta,
          referenceId: productId,
          note: "Opening stock adjust (+)",
          createdById: userId ?? null, // ✅ new
        },
      });
    } else {
      await tx.stockLedger.create({
        data: {
          productId,
          type: "OUT",
          source: "OPENING",
          quantity: Math.abs(delta),
          referenceId: productId,
          note: "Opening stock adjust (-)",
          createdById: userId ?? null, // ✅ new
        },
      });
    }
  }
}
