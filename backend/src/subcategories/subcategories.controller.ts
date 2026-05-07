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
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Permissions } from '../common/decorators';

/**
 * Exposes HTTP endpoints for Subcategories operations.
 */
@ApiTags('Subcategories')
@ApiBearerAuth('access-token')
@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  /**
   * Get all subcategories.
   */
  @Get()
  @Permissions('create_category')
  @ApiOperation({ summary: 'Get all subcategories' })
  async findAll(@Query() query: PaginationDto) {
    return this.subcategoriesService.findAll(query);
  }

  /**
   * Get subcategories by category ID.
   */
  @Get('by-category/:categoryId')
  @Permissions('create_category')
  @ApiOperation({ summary: 'Get subcategories by category ID' })
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.subcategoriesService.findByCategory(categoryId);
  }

  /**
   * Get subcategory by ID.
   */
  @Get(':id')
  @Permissions('create_category')
  @ApiOperation({ summary: 'Get subcategory by ID' })
  async findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(id);
  }

  /**
   * Create new subcategory.
   */
  @Post()
  @Permissions('add_category', 'create_category')
  @ApiOperation({ summary: 'Create new subcategory' })
  async create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  /**
   * Update subcategory.
   */
  @Put(':id')
  @Permissions('edit_category')
  @ApiOperation({ summary: 'Update subcategory' })
  async update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  /**
   * Delete subcategory (soft delete).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('delete_category')
  @ApiOperation({ summary: 'Delete subcategory (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }
}
