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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { OwnersService } from "./owners.service";
import { CreateOwnerDto } from "./dto/create-owner.dto";
import { UpdateOwnerDto } from "./dto/update-owner.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { Permissions } from "../common/decorators";

@ApiTags("Owners")
// @ApiBearerAuth("access-token")
@Controller("owners")
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Get()
  // @Permissions("owner_list")
  @ApiOperation({ summary: "Get all owners" })
  async findAll(@Query() query: PaginationDto) {
    return this.ownersService.findAll(query);
  }

  @Get(":id")
  @Permissions("owner_list")
  @ApiOperation({ summary: "Get owner by ID" })
  async findOne(@Param("id") id: string) {
    return this.ownersService.findOne(id);
  }

  @Post()
  // @Permissions("add_owner")
  @ApiOperation({ summary: "Create new owner" })
  async create(@Body() createOwnerDto: CreateOwnerDto) {
    console.log(createOwnerDto);
    return this.ownersService.create(createOwnerDto);
  }

  @Put(":id")
  @Permissions("edit_owner")
  @ApiOperation({ summary: "Update owner" })
  async update(
    @Param("id") id: string,
    @Body() updateOwnerDto: UpdateOwnerDto,
  ) {
    return this.ownersService.update(id, updateOwnerDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Permissions("delete_owner")
  @ApiOperation({ summary: "Delete owner (soft delete)" })
  async remove(@Param("id") id: string) {
    return this.ownersService.remove(id);
  }
}
