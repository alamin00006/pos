import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { Permissions } from "../common/decorators";

/**
 * Exposes HTTP endpoints for Products operations.
 */
@ApiTags("Products")
@ApiBearerAuth("access-token")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Get all products.
   */
  @Get()
  @Permissions("create_product")
  @ApiOperation({ summary: "Get all products" })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  /**
   * Search products by name, code, or barcode.
   */
  @Get("search")
  @Permissions("create_product")
  @ApiOperation({ summary: "Search products by name, code, or barcode" })
  async search(@Query("q") q: string) {
    return this.productsService.search(q);
  }

  /**
   * Get product by barcode.
   */
  @Get("by-barcode/:barcode")
  @Permissions("create_product")
  @ApiOperation({ summary: "Get product by barcode" })
  async findByBarcode(@Param("barcode") barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }

  /**
   * Get product by ID.
   */
  @Get(":id")
  @Permissions("create_product")
  @ApiOperation({ summary: "Get product by ID" })
  async findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * Get product stock quantity.
   */
  @Get(":id/stock")
  @Permissions("stock")
  @ApiOperation({ summary: "Get product stock quantity" })
  async getStock(@Param("id") id: string) {
    return this.productsService.getStock(id);
  }

  /**
   * Create new product.
   */
  @Post()
  @Permissions("add_product", "create_product")
  @ApiOperation({ summary: "Create new product" })
  async create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    const userId = req?.user?.id ?? req?.user?.sub ?? null; // âœ… adjust based on your JWT payload
    return this.productsService.create(createProductDto, userId);
  }

  /**
   * Update product.
   */
  @Put(":id")
  @Permissions("edit_product")
  @ApiOperation({ summary: "Update product" })
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.id ?? req?.user?.sub ?? null; // âœ… adjust based on your JWT payload
    return this.productsService.update(id, updateProductDto, userId);
  }

  /**
   * Update product sell price.
   */
  @Put(":id/sell-price")
  @Permissions("update_sell_price")
  @ApiOperation({ summary: "Update product sell price" })
  async updateSellPrice(
    @Param("id") id: string,
    @Body("sellPrice") sellPrice: number,
  ) {
    return this.productsService.updateSellPrice(id, sellPrice);
  }

  /**
   * Delete product (soft delete).
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Permissions("delete_product")
  @ApiOperation({ summary: "Delete product (soft delete)" })
  async remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
