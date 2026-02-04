import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: ProductQueryDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        stock: number;
        unit: {
            id: string;
            name: string;
            shortName: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
        } | null;
        category: {
            id: string;
            name: string;
        } | null;
        subcategory: {
            id: string;
            name: string;
        } | null;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        productCode: string;
        barcode: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellPrice: import("@prisma/client/runtime/library").Decimal;
        alertQuantity: number;
        categoryId: string | null;
        subcategoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>>;
    search(q: string): Promise<{
        stock: number;
        unit: {
            id: string;
            name: string;
            shortName: string | null;
        } | null;
        category: {
            id: string;
            name: string;
        } | null;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        productCode: string;
        barcode: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellPrice: import("@prisma/client/runtime/library").Decimal;
        alertQuantity: number;
        categoryId: string | null;
        subcategoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }[]>;
    findByBarcode(barcode: string): Promise<{
        stock: number;
        unit: {
            id: string;
            name: string;
            shortName: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
        } | null;
        category: {
            id: string;
            name: string;
        } | null;
        subcategory: {
            id: string;
            name: string;
        } | null;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        productCode: string;
        barcode: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellPrice: import("@prisma/client/runtime/library").Decimal;
        alertQuantity: number;
        categoryId: string | null;
        subcategoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    findOne(id: string): Promise<{
        stock: number;
        unit: {
            id: string;
            name: string;
            shortName: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
        } | null;
        category: {
            id: string;
            name: string;
        } | null;
        subcategory: {
            id: string;
            name: string;
        } | null;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        productCode: string;
        barcode: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellPrice: import("@prisma/client/runtime/library").Decimal;
        alertQuantity: number;
        categoryId: string | null;
        subcategoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    getStock(id: string): Promise<{
        productId: string;
        stock: number;
    }>;
    create(createProductDto: CreateProductDto): Promise<{
        unit: {
            id: string;
            name: string;
            shortName: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
        } | null;
        category: {
            id: string;
            name: string;
        } | null;
        subcategory: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        productCode: string;
        barcode: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellPrice: import("@prisma/client/runtime/library").Decimal;
        alertQuantity: number;
        categoryId: string | null;
        subcategoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        unit: {
            id: string;
            name: string;
            shortName: string | null;
        } | null;
        brand: {
            id: string;
            name: string;
        } | null;
        category: {
            id: string;
            name: string;
        } | null;
        subcategory: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        productCode: string;
        barcode: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellPrice: import("@prisma/client/runtime/library").Decimal;
        alertQuantity: number;
        categoryId: string | null;
        subcategoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    updateSellPrice(id: string, sellPrice: number): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        productCode: string;
        barcode: string | null;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellPrice: import("@prisma/client/runtime/library").Decimal;
        alertQuantity: number;
        categoryId: string | null;
        subcategoryId: string | null;
        brandId: string | null;
        unitId: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private calculateStock;
}
