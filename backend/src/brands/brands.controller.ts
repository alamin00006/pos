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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Permissions } from '../common/decorators';

/**
 * Exposes HTTP endpoints for Brands operations.
 */
@ApiTags('Brands')
@ApiBearerAuth('access-token')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  /**
   * Get all brands.
   */
  @Get()
  @Permissions('brands')
  @ApiOperation({ summary: 'Get all brands' })
  async findAll(@Query() query: PaginationDto) {
    return this.brandsService.findAll(query);
  }

  /**
   * Get brand by ID.
   */
  @Get(':id')
  @Permissions('brands')
  @ApiOperation({ summary: 'Get brand by ID' })
  async findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  /**
   * Create new brand.
   */
  @Post()
  @Permissions('add_brand')
  @ApiOperation({ summary: 'Create new brand' })
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  /**
   * Update brand.
   */
  @Put(':id')
  @Permissions('edit_brand')
  @ApiOperation({ summary: 'Update brand' })
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  /**
   * Delete brand (soft delete).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('delete_brand')
  @ApiOperation({ summary: 'Delete brand (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
