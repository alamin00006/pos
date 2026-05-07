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
  Patch,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { Permissions } from "../common/decorators";

/**
 * Exposes HTTP endpoints for Users operations.
 */
@ApiTags("Users")
@ApiBearerAuth("access-token")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users.
   */
  @Get()
  @Permissions("create_user")
  @ApiOperation({ summary: "Get all users" })
  async findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  /**
   * Get user by ID.
   */
  @Get(":id")
  @Permissions("create_user")
  @ApiOperation({ summary: "Get user by ID" })
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Create new user.
   */
  @Post()
  @Permissions("add_user", "create_user")
  @ApiOperation({ summary: "Create new user" })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Update user.
   */
  @Patch(":id")
  @Permissions("edit_user")
  @ApiOperation({ summary: "Update user" })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete user (soft delete).
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Permissions("delete_user")
  @ApiOperation({ summary: "Delete user (soft delete)" })
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  /**
   * Assign role to user.
   */
  @Post(":id/assign-role")
  @Permissions("edit_user")
  @ApiOperation({ summary: "Assign role to user" })
  async assignRole(@Param("id") id: string, @Body("roleId") roleId: string) {
    return this.usersService.assignRole(id, roleId);
  }

  /**
   * Remove role from user.
   */
  @Delete(":id/remove-role/:roleId")
  @HttpCode(HttpStatus.OK)
  @Permissions("edit_user")
  @ApiOperation({ summary: "Remove role from user" })
  async removeRole(@Param("id") id: string, @Param("roleId") roleId: string) {
    return this.usersService.removeRole(id, roleId);
  }
}
