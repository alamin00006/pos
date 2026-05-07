import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateAssetDto, UpdateAssetDto } from './dto';

/**
 * Exposes HTTP endpoints for Assets operations.
 */
@ApiTags('Assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly service: AssetsService) {}

  /**
   * Create asset.
   */
  @Post()
  @Permissions('create_assets')
  @ApiOperation({ summary: 'Create asset' })
  create(@Body() dto: CreateAssetDto) {
    return this.service.create(dto);
  }

  /**
   * Get all assets.
   */
  @Get()
  @Permissions('view_assets')
  @ApiOperation({ summary: 'Get all assets' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  /**
   * Get asset by ID.
   */
  @Get(':id')
  @Permissions('view_assets')
  @ApiOperation({ summary: 'Get asset by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Update asset.
   */
  @Patch(':id')
  @Permissions('edit_assets')
  @ApiOperation({ summary: 'Update asset' })
  update(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    return this.service.update(id, dto);
  }

  /**
   * Delete asset.
   */
  @Delete(':id')
  @Permissions('delete_assets')
  @ApiOperation({ summary: 'Delete asset' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
