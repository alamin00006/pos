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
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { Permissions } from "../common/decorators";

/**
 * Exposes HTTP endpoints for Categories operations.
 */
@ApiTags("Categories")
@ApiBearerAuth("access-token")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Get all categories.
   */
  @Get()
  @Permissions("create_category")
  @ApiOperation({ summary: "Get all categories" })
  async findAll(@Query() query: PaginationDto) {
    return this.categoriesService.findAll(query);
  }

  /**
   * Get category by ID.
   */
  @Get(":id")
  @Permissions("create_category")
  @ApiOperation({ summary: "Get category by ID" })
  async findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * Create new category.
   */
  @Post()
  @Permissions("add_category", "create_category")
  @ApiOperation({ summary: "Create new category" })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Update category.
   */
  @Patch(":id")
  @Permissions("edit_category")
  @ApiOperation({ summary: "Update category" })
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * Delete category (soft delete).
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Permissions("delete_category")
  @ApiOperation({ summary: "Delete category (soft delete)" })
  async remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
