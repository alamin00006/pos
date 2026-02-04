import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DamagesService } from './damages.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateDamageDto } from './dto';

@ApiTags('Damages')
@ApiBearerAuth()
@Controller('damages')
export class DamagesController {
  constructor(private readonly service: DamagesService) {}

  @Post()
  @Permissions('add_damage')
  @ApiOperation({ summary: 'Create damage record' })
  create(@Body() dto: CreateDamageDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('view_damage')
  @ApiOperation({ summary: 'Get all damages' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('view_damage')
  @ApiOperation({ summary: 'Get damage by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @Permissions('delete_damage')
  @ApiOperation({ summary: 'Delete damage' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
