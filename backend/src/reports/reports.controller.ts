import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { DateRangeQueryDto, TopItemsQueryDto, CategoryReportQueryDto, CustomerReportQueryDto, SupplierReportQueryDto } from './dto/report-query.dto';
import { Permissions } from '../common/decorators';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('today')
  @Permissions('daily_report')
  @ApiOperation({ summary: 'Get today\'s report' })
  getTodayReport() {
    return this.reportsService.getTodayReport();
  }

  @Get('daily')
  @Permissions('daily_report')
  @ApiOperation({ summary: 'Get daily report with date range' })
  getDailyReport(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getDailyReport(query);
  }

  @Get('current-month')
  @Permissions('current_month_report')
  @ApiOperation({ summary: 'Get current month report' })
  getCurrentMonthReport() {
    return this.reportsService.getCurrentMonthReport();
  }

  @Get('profit-loss')
  @Permissions('profit_loss_report')
  @ApiOperation({ summary: 'Get profit/loss report' })
  getProfitLossReport(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getProfitLossReport(query);
  }

  @Get('top-products')
  @Permissions('top_product_report')
  @ApiOperation({ summary: 'Get top selling products report' })
  getTopProductsReport(@Query() query: TopItemsQueryDto) {
    return this.reportsService.getTopProductsReport(query);
  }

  @Get('top-customers')
  @Permissions('top_customer_report')
  @ApiOperation({ summary: 'Get top customers report' })
  getTopCustomersReport(@Query() query: TopItemsQueryDto) {
    return this.reportsService.getTopCustomersReport(query);
  }

  @Get('category-wise')
  @Permissions('category_wise_report')
  @ApiOperation({ summary: 'Get category-wise sales/purchase report' })
  getCategoryWiseReport(@Query() query: CategoryReportQueryDto) {
    return this.reportsService.getCategoryWiseReport(query);
  }

  @Get('sales')
  @Permissions('sales_report')
  @ApiOperation({ summary: 'Get sales report' })
  getSalesReport(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getSalesReport(query);
  }

  @Get('purchases')
  @Permissions('purchase_report')
  @ApiOperation({ summary: 'Get purchases report' })
  getPurchaseReport(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getPurchaseReport(query);
  }

  @Get('customer-due')
  @Permissions('customer_due_report')
  @ApiOperation({ summary: 'Get customer due report' })
  getCustomerDueReport(@Query() query: CustomerReportQueryDto) {
    return this.reportsService.getCustomerDueReport(query);
  }

  @Get('supplier-due')
  @Permissions('supplier_due_report')
  @ApiOperation({ summary: 'Get supplier due report' })
  getSupplierDueReport(@Query() query: SupplierReportQueryDto) {
    return this.reportsService.getSupplierDueReport(query);
  }

  @Get('low-stock')
  @Permissions('low_stock_report')
  @ApiOperation({ summary: 'Get low stock report' })
  getLowStockReport() {
    return this.reportsService.getLowStockReport();
  }

  @Get('summary')
  @Permissions('summary_report')
  @ApiOperation({ summary: 'Get overall summary report' })
  getSummaryReport() {
    return this.reportsService.getSummaryReport();
  }
}
