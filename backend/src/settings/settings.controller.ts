import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Permissions } from '../common/decorators';
import { BulkUpsertSettingsDto } from './dto';

/**
 * Exposes HTTP endpoints for Settings operations.
 */
@ApiTags('Settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  /**
   * Get all settings.
   */
  @Get()
  @Permissions('settings')
  @ApiOperation({ summary: 'Get all settings' })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Get setting by key.
   */
  @Get(':key')
  @Permissions('settings')
  @ApiOperation({ summary: 'Get setting by key' })
  get(@Param('key') key: string) {
    return this.service.get(key);
  }

  /**
   * Update settings (bulk upsert).
   */
  @Post()
  @Permissions('settings')
  @ApiOperation({ summary: 'Update settings (bulk upsert)' })
  @ApiBody({ type: BulkUpsertSettingsDto })
  setMany(@Body() dto: BulkUpsertSettingsDto) {
    return this.service.setMany(dto.settings);
  }
}
