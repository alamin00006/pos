import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpenseCategoriesService } from './expense-categories.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto';

/**
 * Exposes HTTP endpoints for Expense Categories operations.
 */
@ApiTags('Expense Categories')
@ApiBearerAuth()
@Controller('expense-categories')
export class ExpenseCategoriesController {
  constructor(private readonly service: ExpenseCategoriesService) {}

  /**
   * Create expense category.
   */
  @Post()
  @Permissions('add_expense_category')
  @ApiOperation({ summary: 'Create expense category' })
  create(@Body() dto: CreateExpenseCategoryDto) {
    return this.service.create(dto);
  }

  /**
   * Get all expense categories.
   */
  @Get()
  @Permissions('create_expense_category')
  @ApiOperation({ summary: 'Get all expense categories' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  /**
   * Get expense category by ID.
   */
  @Get(':id')
  @Permissions('create_expense_category')
  @ApiOperation({ summary: 'Get expense category by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Update expense category.
   */
  @Patch(':id')
  @Permissions('edit_expense_category')
  @ApiOperation({ summary: 'Update expense category' })
  update(@Param('id') id: string, @Body() dto: UpdateExpenseCategoryDto) {
    return this.service.update(id, dto);
  }

  /**
   * Delete expense category.
   */
  @Delete(':id')
  @Permissions('delete_expense_category')
  @ApiOperation({ summary: 'Delete expense category' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
