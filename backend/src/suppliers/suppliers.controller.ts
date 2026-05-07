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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierPaymentDto } from './dto/supplier-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CurrentBranch, Permissions, CurrentUser } from '../common/decorators';

/**
 * Exposes HTTP endpoints for Suppliers operations.
 */
@ApiTags('Suppliers')
@ApiBearerAuth('access-token')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  /**
   * Get all suppliers.
   */
  @Get()
  @Permissions('create_supplier')
  @ApiOperation({
    summary: 'Get all suppliers',
    description: 'Returns branch-scoped suppliers with pagination, search, sorting, and calculated due amount.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'ABC' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Paginated supplier list returned successfully.' })
  async findAll(@Query() query: PaginationDto, @CurrentBranch() branchId?: string) {
    return this.suppliersService.findAll(query, branchId);
  }

  /**
   * Get suppliers with due amounts.
   */
  @Get('due-report')
  @Permissions('supplier_due_report')
  @ApiOperation({
    summary: 'Get suppliers with due amounts',
    description: 'Returns only suppliers whose calculated ledger balance is greater than zero.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Supplier due report returned successfully.' })
  async getDueReport(@Query() query: PaginationDto, @CurrentBranch() branchId?: string) {
    return this.suppliersService.getDueReport(query, branchId);
  }

  /**
   * Get supplier by ID.
   */
  @Get(':id')
  @Permissions('create_supplier')
  @ApiOperation({
    summary: 'Get supplier by ID',
    description: 'Returns one branch-scoped supplier with its current due amount.',
  })
  @ApiParam({ name: 'id', description: 'Supplier ID', example: 'seed-supplier-1' })
  @ApiResponse({ status: 200, description: 'Supplier returned successfully.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  async findOne(@Param('id') id: string, @CurrentBranch() branchId?: string) {
    return this.suppliersService.findOne(id, branchId);
  }

  /**
   * Get supplier ledger.
   */
  @Get(':id/ledger')
  @Permissions('supplier_ledger', 'supplier_ledger_report')
  @ApiOperation({
    summary: 'Get supplier ledger',
    description: 'Returns paginated payable ledger entries for a supplier.',
  })
  @ApiParam({ name: 'id', description: 'Supplier ID', example: 'seed-supplier-1' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Supplier ledger returned successfully.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  async getLedger(@Param('id') id: string, @Query() query: PaginationDto) {
    return this.suppliersService.getLedger(id, query);
  }

  /**
   * Create new supplier.
   */
  @Post()
  @Permissions('add_supplier', 'create_supplier', 'purchase_add_supplier')
  @ApiOperation({
    summary: 'Create new supplier',
    description: 'Creates a supplier for the current branch and adds an opening-balance ledger entry when provided.',
  })
  @ApiBody({ type: CreateSupplierDto })
  @ApiResponse({ status: 201, description: 'Supplier created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid supplier payload.' })
  async create(@Body() createSupplierDto: CreateSupplierDto, @CurrentUser('sub') userId: string, @CurrentBranch() branchId?: string) {
    return this.suppliersService.create(createSupplierDto, userId, branchId);
  }

  /**
   * Update supplier.
   */
  @Put(':id')
  @Permissions('edit_supplier')
  @ApiOperation({
    summary: 'Update supplier',
    description: 'Updates contact and profile details for an existing supplier.',
  })
  @ApiParam({ name: 'id', description: 'Supplier ID', example: 'seed-supplier-1' })
  @ApiBody({ type: UpdateSupplierDto })
  @ApiResponse({ status: 200, description: 'Supplier updated successfully.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  /**
   * Delete supplier (soft delete).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('delete_supplier')
  @ApiOperation({
    summary: 'Delete supplier (soft delete)',
    description: 'Marks a supplier as deleted while preserving historical purchases, payments, and ledger rows.',
  })
  @ApiParam({ name: 'id', description: 'Supplier ID', example: 'seed-supplier-1' })
  @ApiResponse({ status: 200, description: 'Supplier deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  async remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }

  /**
   * Make payment to supplier.
   */
  @Post(':id/payment')
  @Permissions('supplier_make_payment')
  @ApiOperation({
    summary: 'Make payment to supplier',
    description:
      'Records a supplier payment, updates supplier ledger balance, and posts either a branch cash-book OUT entry or a bank withdrawal transaction.',
  })
  @ApiParam({ name: 'id', description: 'Supplier ID', example: 'seed-supplier-1' })
  @ApiBody({ type: SupplierPaymentDto })
  @ApiResponse({ status: 201, description: 'Supplier payment recorded successfully.' })
  @ApiResponse({ status: 400, description: 'Payment exceeds due amount or bank account is missing for non-cash payment.' })
  @ApiResponse({ status: 404, description: 'Supplier or bank account not found.' })
  async makePayment(@Param('id') id: string, @Body() paymentDto: SupplierPaymentDto, @CurrentBranch() branchId?: string) {
    return this.suppliersService.makePayment(id, paymentDto, branchId);
  }
}
