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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Permissions } from '../common/decorators';

/**
 * Exposes HTTP endpoints for Roles operations.
 */
@ApiTags('Roles')
@ApiBearerAuth('access-token')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Get all roles.
   */
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  async findAll(@Query() query: PaginationDto) {
    return this.rolesService.findAll(query);
  }

  /**
   * Get role by ID with permissions.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID with permissions' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  /**
   * Create new role.
   */
  @Post()
  @Permissions('add_user')
  @ApiOperation({ summary: 'Create new role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Update role.
   */
  @Put(':id')
  @Permissions('edit_user')
  @ApiOperation({ summary: 'Update role' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  /**
   * Delete role (soft delete).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions('delete_user')
  @ApiOperation({ summary: 'Delete role (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  /**
   * Assign permissions to role.
   */
  @Post(':id/permissions')
  @Permissions('edit_user')
  @ApiOperation({ summary: 'Assign permissions to role' })
  async assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, assignPermissionsDto.permissionIds);
  }

  /**
   * Update role permissions (replace all).
   */
  @Put(':id/permissions')
  @Permissions('edit_user')
  @ApiOperation({ summary: 'Update role permissions (replace all)' })
  async updatePermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.rolesService.updatePermissions(id, assignPermissionsDto.permissionIds);
  }
}
