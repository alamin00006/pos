import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto, UpdatePurchaseDto, PurchaseQueryDto, AddPurchasePaymentDto } from './dto';
import { CurrentBranch, CurrentUser, Permissions } from '../common/decorators';

@ApiTags('Purchases')
@ApiBearerAuth()
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @Permissions('create_purchase')
  @ApiOperation({ summary: 'Create a new purchase' })
  create(@Body() dto: CreatePurchaseDto, @CurrentUser('sub') userId: string, @CurrentBranch() branchId?: string) {
    return this.purchasesService.create(dto, userId, branchId);
  }

  @Get()
  @Permissions('view_purchase')
  @ApiOperation({ summary: 'Get all purchases with pagination and filters' })
  findAll(@Query() query: PurchaseQueryDto, @CurrentBranch() branchId?: string) {
    return this.purchasesService.findAll(query, branchId);
  }

  @Get(':id')
  @Permissions('view_purchase')
  @ApiOperation({ summary: 'Get a purchase by ID' })
  findOne(@Param('id') id: string, @CurrentBranch() branchId?: string) {
    return this.purchasesService.findOne(id, branchId);
  }

  @Get(':id/receipt')
  @Permissions('purchase_receipt')
  @ApiOperation({ summary: 'Get purchase receipt' })
  getReceipt(@Param('id') id: string) {
    return this.purchasesService.getReceipt(id);
  }

  @Patch(':id')
  @Permissions('edit_purchase')
  @ApiOperation({ summary: 'Update a purchase' })
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseDto) {
    return this.purchasesService.update(id, dto);
  }

  @Post(':id/payments')
  @Permissions('purchase_add_payment')
  @ApiOperation({ summary: 'Add payment to a purchase' })
  addPayment(@Param('id') id: string, @Body() dto: AddPurchasePaymentDto, @CurrentBranch() branchId?: string) {
    return this.purchasesService.addPayment(id, dto, branchId);
  }

  @Delete(':id')
  @Permissions('delete_purchase')
  @ApiOperation({ summary: 'Delete a purchase (soft delete)' })
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id);
  }

  @Get('supplier/:supplierId')
  @Permissions('view_purchase')
  @ApiOperation({ summary: 'Get purchases by supplier' })
  getSupplierPurchases(@Param('supplierId') supplierId: string, @Query() query: PurchaseQueryDto) {
    return this.purchasesService.getSupplierPurchases(supplierId, query);
  }
}
