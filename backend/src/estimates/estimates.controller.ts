import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EstimatesService } from './estimates.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateEstimateDto, UpdateEstimateDto } from './dto';
import { IsOptional, IsUUID } from 'class-validator';

class EstimateQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;
}

/**
 * Exposes HTTP endpoints for Estimates operations.
 */
@ApiTags('Estimates')
@ApiBearerAuth()
@Controller('estimates')
export class EstimatesController {
  constructor(private readonly service: EstimatesService) {}

  /**
   * Create estimate.
   */
  @Post()
  @Permissions('add_estimate')
  @ApiOperation({ summary: 'Create estimate' })
  create(@Body() dto: CreateEstimateDto) {
    return this.service.create(dto);
  }

  /**
   * Get all estimates.
   */
  @Get()
  @Permissions('view_estimate')
  @ApiOperation({ summary: 'Get all estimates' })
  findAll(@Query() query: EstimateQueryDto) {
    return this.service.findAll(query);
  }

  /**
   * Get estimate by ID.
   */
  @Get(':id')
  @Permissions('view_estimate')
  @ApiOperation({ summary: 'Get estimate by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Update estimate.
   */
  @Patch(':id')
  @Permissions('edit_estimate')
  @ApiOperation({ summary: 'Update estimate' })
  update(@Param('id') id: string, @Body() dto: UpdateEstimateDto) {
    return this.service.update(id, dto);
  }

  /**
   * Delete estimate.
   */
  @Delete(':id')
  @Permissions('delete_estimate')
  @ApiOperation({ summary: 'Delete estimate' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
