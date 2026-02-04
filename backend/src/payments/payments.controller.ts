import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreatePaymentDto } from './dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  @Permissions('add_payment')
  @ApiOperation({ summary: 'Create payment' })
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('view_payment')
  @ApiOperation({ summary: 'Get all payments' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('view_payment')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @Permissions('delete_payment')
  @ApiOperation({ summary: 'Delete payment' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
