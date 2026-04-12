import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { Permissions } from '../common/decorators';

@ApiTags('Backup')
@ApiBearerAuth()
@Controller('backup')
export class BackupController {
  constructor(private readonly service: BackupService) {}

  @Get()
  @Permissions('backup')
  @ApiOperation({ summary: 'Get backup information and instructions' })
  getBackupInfo() { return this.service.getBackupInfo(); }

  @Get('export')
  @Permissions('backup')
  @Header('Content-Disposition', 'attachment; filename="pos-backup.json"')
  @ApiOperation({ summary: 'Export application data as JSON backup' })
  exportData() { return this.service.exportData(); }
}
