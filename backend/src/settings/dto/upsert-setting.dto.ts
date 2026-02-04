import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertSettingDto {
  @ApiProperty({ example: 'company_name' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'My Business Inc.' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: 'general' })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiPropertyOptional({ example: 'Company display name' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class BulkUpsertSettingsDto {
  @ApiProperty({
    type: 'object',
    example: {
      company_name: 'My Business Inc.',
      company_email: 'info@mybusiness.com',
      currency: 'USD',
    },
  })
  settings: Record<string, string>;
}
