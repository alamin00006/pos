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
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Permissions } from '../common/decorators';

@ApiTags('Units')
@ApiBearerAuth('access-token')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @Permissions('units')
  @ApiOperation({ summary: 'Get all units' })
  async findAll(@Query() query: PaginationDto) {
    return this.unitsService.findAll(query);
  }

  @Get(':id')
  @Permissions('units')
  @ApiOperation({ summary: 'Get unit by ID' })
  async findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Post()
  @Permissions('add_unit')
  @ApiOperation({ summary: 'Create new unit' })
  async create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Put(':id')
  @Permissions('edit_unit')
  @ApiOperation({ summary: 'Update unit' })
  async update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('edit_unit')
  @ApiOperation({ summary: 'Delete unit (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
