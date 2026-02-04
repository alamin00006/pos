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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierPaymentDto } from './dto/supplier-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Permissions, CurrentUser } from '../common/decorators';

@ApiTags('Suppliers')
@ApiBearerAuth('access-token')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @Permissions('create_supplier')
  @ApiOperation({ summary: 'Get all suppliers' })
  async findAll(@Query() query: PaginationDto) {
    return this.suppliersService.findAll(query);
  }

  @Get('due-report')
  @Permissions('supplier_due_report')
  @ApiOperation({ summary: 'Get suppliers with due amounts' })
  async getDueReport(@Query() query: PaginationDto) {
    return this.suppliersService.getDueReport(query);
  }

  @Get(':id')
  @Permissions('create_supplier')
  @ApiOperation({ summary: 'Get supplier by ID' })
  async findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  @Get(':id/ledger')
  @Permissions('supplier_ledger', 'supplier_ledger_report')
  @ApiOperation({ summary: 'Get supplier ledger' })
  async getLedger(@Param('id') id: string, @Query() query: PaginationDto) {
    return this.suppliersService.getLedger(id, query);
  }

  @Post()
  @Permissions('add_supplier', 'create_supplier', 'purchase_add_supplier')
  @ApiOperation({ summary: 'Create new supplier' })
  async create(@Body() createSupplierDto: CreateSupplierDto, @CurrentUser('sub') userId: string) {
    return this.suppliersService.create(createSupplierDto, userId);
  }

  @Put(':id')
  @Permissions('edit_supplier')
  @ApiOperation({ summary: 'Update supplier' })
  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('delete_supplier')
  @ApiOperation({ summary: 'Delete supplier (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }

  @Post(':id/payment')
  @Permissions('supplier_make_payment')
  @ApiOperation({ summary: 'Make payment to supplier' })
  async makePayment(@Param('id') id: string, @Body() paymentDto: SupplierPaymentDto) {
    return this.suppliersService.makePayment(id, paymentDto);
  }
}
