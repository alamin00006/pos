import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Post()
  @Permissions('add_expense')
  @ApiOperation({ summary: 'Create expense' })
  create(@Body() dto: CreateExpenseDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('create_expense')
  @ApiOperation({ summary: 'Get all expenses' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('create_expense')
  @ApiOperation({ summary: 'Get expense by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions('edit_expense')
  @ApiOperation({ summary: 'Update expense' })
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete_expense')
  @ApiOperation({ summary: 'Delete expense' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
