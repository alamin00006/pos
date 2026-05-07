import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';

/**
 * Exposes HTTP endpoints for Employees operations.
 */
@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  /**
   * Create employee.
   */
  @Post()
  @Permissions('add_employee')
  @ApiOperation({ summary: 'Create employee' })
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  /**
   * Get all employees.
   */
  @Get()
  @Permissions('create_employee')
  @ApiOperation({ summary: 'Get all employees' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  /**
   * Get employee by ID.
   */
  @Get(':id')
  @Permissions('create_employee')
  @ApiOperation({ summary: 'Get employee by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Update employee.
   */
  @Patch(':id')
  @Permissions('edit_employee')
  @ApiOperation({ summary: 'Update employee' })
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, dto);
  }

  /**
   * Delete employee.
   */
  @Delete(':id')
  @Permissions('delete_employee')
  @ApiOperation({ summary: 'Delete employee' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
