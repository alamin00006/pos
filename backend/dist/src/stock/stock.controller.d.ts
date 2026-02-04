import { StockService } from './stock.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { StockQueryDto } from './dto/stock-query.dto';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    getStockReport(query: StockQueryDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        stock: number;
        stockValue: number;
        isLowStock: boolean;
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
    }>>;
    getLowStock(query: StockQueryDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
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
    }>>;
    getProductLedger(productId: string, query: StockQueryDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        balance: number;
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.StockLedgerType;
        referenceId: string | null;
        productId: string;
        quantity: number;
        note: string | null;
        source: import(".prisma/client").$Enums.StockLedgerSource;
    }>>;
    adjustStock(adjustStockDto: AdjustStockDto): Promise<{
        message: string;
        stock: number;
    }>;
    setOpeningStock(productId: string, quantity: number, note?: string): Promise<{
        message: string;
        stock: number;
    }>;
}
