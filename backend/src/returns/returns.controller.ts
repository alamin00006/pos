import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateReturnDto } from './dto';

/**
 * Exposes HTTP endpoints for Returns operations.
 */
@ApiTags('Returns')
@ApiBearerAuth()
@Controller('returns')
export class ReturnsController {
  constructor(private readonly service: ReturnsService) {}

  /**
   * Create a return.
   */
  @Post()
  @Permissions('list_return')
  @ApiOperation({ summary: 'Create a return' })
  create(@Body() dto: CreateReturnDto) {
    return this.service.create(dto);
  }

  /**
   * Get all returns.
   */
  @Get()
  @Permissions('list_return')
  @ApiOperation({ summary: 'Get all returns' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  /**
   * Get return by ID.
   */
  @Get(':id')
  @Permissions('list_return')
  @ApiOperation({ summary: 'Get return by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Delete a return.
   */
  @Delete(':id')
  @Permissions('delete_return')
  @ApiOperation({ summary: 'Delete a return' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
