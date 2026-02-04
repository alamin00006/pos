import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerPaymentDto } from './dto/customer-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Permissions, CurrentUser } from '../common/decorators';

@ApiTags('Customers')
@ApiBearerAuth('access-token')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Permissions('create_customer')
  @ApiOperation({ summary: 'Get all customers' })
  async findAll(@Query() query: PaginationDto) { return this.customersService.findAll(query); }

  @Get('due-report')
  @Permissions('customer_due_report')
  @ApiOperation({ summary: 'Get customers with due amounts' })
  async getDueReport(@Query() query: PaginationDto) { return this.customersService.getDueReport(query); }

  @Get(':id')
  @Permissions('create_customer')
  @ApiOperation({ summary: 'Get customer by ID' })
  async findOne(@Param('id') id: string) { return this.customersService.findOne(id); }

  @Get(':id/ledger')
  @Permissions('customer_ledger', 'customer_ledger_report')
  @ApiOperation({ summary: 'Get customer ledger' })
  async getLedger(@Param('id') id: string, @Query() query: PaginationDto) { return this.customersService.getLedger(id, query); }

  @Post()
  @Permissions('add_customer', 'create_customer', 'pos_add_customer')
  @ApiOperation({ summary: 'Create new customer' })
  async create(@Body() dto: CreateCustomerDto, @CurrentUser('sub') userId: string) { return this.customersService.create(dto, userId); }

  @Put(':id')
  @Permissions('edit_customer')
  @ApiOperation({ summary: 'Update customer' })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) { return this.customersService.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('delete_customer')
  @ApiOperation({ summary: 'Delete customer' })
  async remove(@Param('id') id: string) { return this.customersService.remove(id); }

  @Post(':id/payment')
  @Permissions('customer_make_payment')
  @ApiOperation({ summary: 'Receive payment from customer' })
  async makePayment(@Param('id') id: string, @Body() dto: CustomerPaymentDto) { return this.customersService.makePayment(id, dto); }
}
