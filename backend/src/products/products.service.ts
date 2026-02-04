import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery } from '../common/utils/pagination.util';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { page, limit, search, sortBy, sortOrder, categoryId, subcategoryId, brandId } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);

    const where: any = {
      ...this.prisma.notDeleted(),
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { productCode: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
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

    // Calculate stock for each product
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stock = await this.calculateStock(product.id);
        return { ...product, stock };
      }),
    );

    return paginate(productsWithStock, total, page!, limit!);
  }

  async search(q: string) {
    if (!q || q.length < 2) return [];

    const products = await this.prisma.product.findMany({
      where: {
        ...this.prisma.notDeleted(),
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { productCode: { contains: q, mode: 'insensitive' } },
          { barcode: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
      include: {
        category: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true, shortName: true } },
      },
    });

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        stock: await this.calculateStock(product.id),
      })),
    );
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

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      ...product,
      stock: await this.calculateStock(product.id),
    };
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

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      ...product,
      stock: await this.calculateStock(product.id),
    };
  }

  async getStock(id: string) {
    await this.findOne(id);
    const stock = await this.calculateStock(id);
    return { productId: id, stock };
  }

  async create(createProductDto: CreateProductDto) {
    // Check for duplicate product code
    const existingCode = await this.prisma.product.findUnique({
      where: { productCode: createProductDto.productCode },
    });

    if (existingCode) {
      throw new ConflictException('Product code already exists');
    }

    if (createProductDto.barcode) {
      const existingBarcode = await this.prisma.product.findUnique({
        where: { barcode: createProductDto.barcode },
      });
      if (existingBarcode) {
        throw new ConflictException('Barcode already exists');
      }
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true, shortName: true } },
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.productCode && updateProductDto.productCode !== product.productCode) {
      const existing = await this.prisma.product.findUnique({
        where: { productCode: updateProductDto.productCode },
      });
      if (existing) {
        throw new ConflictException('Product code already exists');
      }
    }

    if (updateProductDto.barcode && updateProductDto.barcode !== product.barcode) {
      const existing = await this.prisma.product.findUnique({
        where: { barcode: updateProductDto.barcode },
      });
      if (existing) {
        throw new ConflictException('Barcode already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true, shortName: true } },
      },
    });
  }

  async updateSellPrice(id: string, sellPrice: number) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { sellPrice },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.update({
      where: { id },
      data: this.prisma.softDelete(),
    });
    return { message: 'Product deleted successfully' };
  }

  private async calculateStock(productId: string): Promise<number> {
    const result = await this.prisma.stockLedger.aggregate({
      where: { productId },
      _sum: {
        quantity: true,
      },
    });

    return result._sum.quantity || 0;
  }
}
