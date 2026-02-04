import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalaryService } from './salary.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateSalaryDto } from './dto';

@ApiTags('Salary')
@ApiBearerAuth()
@Controller('salary')
export class SalaryController {
  constructor(private readonly service: SalaryService) {}

  @Post()
  @Permissions('employee_salary')
  @ApiOperation({ summary: 'Create salary payment' })
  create(@Body() dto: CreateSalaryDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('employee_salary')
  @ApiOperation({ summary: 'Get all salary payments' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('employee_salary')
  @ApiOperation({ summary: 'Get salary payment by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
