import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalaryService } from './salary.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateSalaryDto } from './dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

class SalaryQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;
}

/**
 * Exposes HTTP endpoints for Salary operations.
 */
@ApiTags('Salary')
@ApiBearerAuth()
@Controller('salary')
export class SalaryController {
  constructor(private readonly service: SalaryService) {}

  /**
   * Create salary payment.
   */
  @Post()
  @Permissions('employee_salary')
  @ApiOperation({ summary: 'Create salary payment' })
  create(@Body() dto: CreateSalaryDto) {
    return this.service.create(dto);
  }

  /**
   * Get all salary payments.
   */
  @Get()
  @Permissions('employee_salary')
  @ApiOperation({ summary: 'Get all salary payments' })
  findAll(@Query() query: SalaryQueryDto) {
    return this.service.findAll(query);
  }

  /**
   * Get salary payment by ID.
   */
  @Get(':id')
  @Permissions('employee_salary')
  @ApiOperation({ summary: 'Get salary payment by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
