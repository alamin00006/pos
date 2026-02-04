import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Permissions')
@ApiBearerAuth('access-token')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll(@Query() query: PaginationDto) {
    return this.permissionsService.findAll(query);
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Get permissions grouped by module' })
  async findAllGrouped() {
    return this.permissionsService.findAllGrouped();
  }
}
