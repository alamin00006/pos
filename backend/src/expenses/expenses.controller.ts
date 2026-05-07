import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

class ExpenseQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  expenseCategoryId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

/**
 * Exposes HTTP endpoints for Expenses operations.
 */
@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  /**
   * Create expense.
   */
  @Post()
  @Permissions('add_expense')
  @ApiOperation({ summary: 'Create expense' })
  create(@Body() dto: CreateExpenseDto) {
    return this.service.create(dto);
  }

  /**
   * Get all expenses.
   */
  @Get()
  @Permissions('create_expense')
  @ApiOperation({ summary: 'Get all expenses' })
  findAll(@Query() query: ExpenseQueryDto) {
    return this.service.findAll(query);
  }

  /**
   * Get expense by ID.
   */
  @Get(':id')
  @Permissions('create_expense')
  @ApiOperation({ summary: 'Get expense by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Update expense.
   */
  @Patch(':id')
  @Permissions('edit_expense')
  @ApiOperation({ summary: 'Update expense' })
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.service.update(id, dto);
  }

  /**
   * Delete expense.
   */
  @Delete(':id')
  @Permissions('delete_expense')
  @ApiOperation({ summary: 'Delete expense' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
