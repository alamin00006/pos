import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { Permissions } from '../common/decorators';

/**
 * Exposes HTTP endpoints for Backup operations.
 */
@ApiTags('Backup')
@ApiBearerAuth()
@Controller('backup')
export class BackupController {
  constructor(private readonly service: BackupService) {}

  /**
   * Get backup information and instructions.
   */
  @Get()
  @Permissions('backup')
  @ApiOperation({ summary: 'Get backup information and instructions' })
  getBackupInfo() { return this.service.getBackupInfo(); }

  /**
   * Export application data as JSON backup.
   */
  @Get('export')
  @Permissions('backup')
  @Header('Content-Disposition', 'attachment; filename="pos-backup.json"')
  @ApiOperation({ summary: 'Export application data as JSON backup' })
  exportData() { return this.service.exportData(); }
}
