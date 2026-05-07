import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Permissions } from '../common/decorators';
import { AssignUserBranchDto, CreateBranchDto, UpdateBranchDto } from './dto';
import { BranchesService } from './branches.service';

/**
 * Exposes HTTP endpoints for Branches operations.
 */
@ApiTags('Branches')
@ApiBearerAuth()
@Controller('branches')
export class BranchesController {
  constructor(private readonly service: BranchesService) {}

  /**
   * Get all branches.
   */
  @Get()
  @Permissions('settings')
  @ApiOperation({ summary: 'Get all branches' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  /**
   * Get branch by ID.
   */
  @Get(':id')
  @Permissions('settings')
  @ApiOperation({ summary: 'Get branch by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Create branch.
   */
  @Post()
  @Permissions('settings')
  @ApiOperation({ summary: 'Create branch' })
  create(@Body() dto: CreateBranchDto) {
    return this.service.create(dto);
  }

  /**
   * Update branch.
   */
  @Patch(':id')
  @Permissions('settings')
  @ApiOperation({ summary: 'Update branch' })
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.service.update(id, dto);
  }

  /**
   * Delete branch.
   */
  @Delete(':id')
  @Permissions('settings')
  @ApiOperation({ summary: 'Delete branch' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  /**
   * Assign user to branch.
   */
  @Post(':id/users')
  @Permissions('settings')
  @ApiOperation({ summary: 'Assign user to branch' })
  assignUser(@Param('id') id: string, @Body() dto: AssignUserBranchDto) {
    return this.service.assignUser(id, dto);
  }

  /**
   * Remove user from branch.
   */
  @Delete(':id/users/:userId')
  @Permissions('settings')
  @ApiOperation({ summary: 'Remove user from branch' })
  removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.service.removeUser(id, userId);
  }
}
