import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EstimatesService } from './estimates.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateEstimateDto, UpdateEstimateDto } from './dto';

@ApiTags('Estimates')
@ApiBearerAuth()
@Controller('estimates')
export class EstimatesController {
  constructor(private readonly service: EstimatesService) {}

  @Post()
  @Permissions('add_estimate')
  @ApiOperation({ summary: 'Create estimate' })
  create(@Body() dto: CreateEstimateDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('view_estimate')
  @ApiOperation({ summary: 'Get all estimates' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('view_estimate')
  @ApiOperation({ summary: 'Get estimate by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions('edit_estimate')
  @ApiOperation({ summary: 'Update estimate' })
  update(@Param('id') id: string, @Body() dto: UpdateEstimateDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete_estimate')
  @ApiOperation({ summary: 'Delete estimate' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
