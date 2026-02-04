import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { StockQueryDto } from './dto/stock-query.dto';
import { Permissions } from '../common/decorators';

@ApiTags('Stock')
@ApiBearerAuth('access-token')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @Permissions('stock')
  @ApiOperation({ summary: 'Get stock report for all products' })
  async getStockReport(@Query() query: StockQueryDto) {
    return this.stockService.getStockReport(query);
  }

  @Get('low')
  @Permissions('low_stock_report')
  @ApiOperation({ summary: 'Get low stock products' })
  async getLowStock(@Query() query: StockQueryDto) {
    return this.stockService.getLowStock(query);
  }

  @Get('ledger/:productId')
  @Permissions('stock')
  @ApiOperation({ summary: 'Get stock ledger for a product' })
  async getProductLedger(@Param('productId') productId: string, @Query() query: StockQueryDto) {
    return this.stockService.getProductLedger(productId, query);
  }

  @Post('adjust')
  @Permissions('barcode_add_stock')
  @ApiOperation({ summary: 'Manually adjust stock' })
  async adjustStock(@Body() adjustStockDto: AdjustStockDto) {
    return this.stockService.adjustStock(adjustStockDto);
  }

  @Post('opening/:productId')
  @Permissions('barcode_add_stock')
  @ApiOperation({ summary: 'Set opening stock for a product' })
  async setOpeningStock(
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
    @Body('note') note?: string,
  ) {
    return this.stockService.setOpeningStock(productId, quantity, note);
  }
}
