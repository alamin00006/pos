import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto, SaleQueryDto, AddSalePaymentDto, RefundSaleDto } from './dto';
import { CurrentBranch, Permissions, CurrentUser } from '../common/decorators';

@ApiTags('Sales')
@ApiBearerAuth('access-token')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @Permissions('sales_list', 'add_sale')
  @ApiOperation({ summary: 'Get all sales with pagination and filtering' })
  async findAll(@Query() query: SaleQueryDto, @CurrentBranch() branchId?: string) {
    return this.salesService.findAll(query, branchId);
  }

  @Get('today')
  @Permissions('today_sold', 'dashboard')
  @ApiOperation({ summary: 'Get today sales summary' })
  async getTodaySales(@CurrentBranch() branchId?: string) {
    return this.salesService.getTodaySales(branchId);
  }

  @Get('report')
  @Permissions('sales_report')
  @ApiOperation({ summary: 'Get sales report with date range' })
  async getSalesReport(@Query() query: SaleQueryDto, @CurrentBranch() branchId?: string) {
    return this.salesService.getSalesReport(query, branchId);
  }

  @Get(':id')
  @Permissions('view_sale', 'sales_list')
  @ApiOperation({ summary: 'Get sale by ID' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  async findOne(@Param('id') id: string, @CurrentBranch() branchId?: string) {
    return this.salesService.findOne(id, branchId);
  }

  @Get(':id/receipt')
  @Permissions('sale_receipt')
  @ApiOperation({ summary: 'Get sale receipt with company details' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  async getReceipt(@Param('id') id: string) {
    return this.salesService.getReceipt(id);
  }

  @Post()
  @Permissions('add_sale')
  @ApiOperation({ summary: 'Create new sale (POS)' })
  async create(@Body() dto: CreateSaleDto, @CurrentUser('sub') userId: string, @CurrentBranch() branchId?: string) {
    return this.salesService.create(dto, userId, branchId);
  }

  @Put(':id')
  @Permissions('edit_sale_payment')
  @ApiOperation({ summary: 'Update sale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateSaleDto) {
    return this.salesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('delete_return')
  @ApiOperation({ summary: 'Delete sale (soft delete)' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  async remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }

  @Post(':id/payment')
  @Permissions('edit_sale_payment')
  @ApiOperation({ summary: 'Add payment to existing sale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  async addPayment(@Param('id') id: string, @Body() dto: AddSalePaymentDto, @CurrentBranch() branchId?: string) {
    return this.salesService.addPayment(id, dto, branchId);
  }

  @Post(':id/duplicate')
  @Permissions('pos_duplicate_sale')
  @ApiOperation({ summary: 'Duplicate an existing sale' })
  @ApiParam({ name: 'id', description: 'Sale ID to duplicate' })
  async duplicate(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.salesService.duplicate(id, userId);
  }

  @Post(':id/refund')
  @Permissions('pos_refund_sale')
  @ApiOperation({ summary: 'Refund a sale (create return)' })
  @ApiParam({ name: 'id', description: 'Sale ID to refund' })
  async refund(@Param('id') id: string, @Body() dto: RefundSaleDto) {
    return this.salesService.refund(id, dto);
  }
}
