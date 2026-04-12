import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  IsIn,
} from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 'Dell Laptop' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'AST-001' })
  @IsOptional()
  @IsString()
  assetCode?: string;

  @ApiPropertyOptional({ example: 'Electronics' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional({ example: 800 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depreciationYears?: number;

  @ApiPropertyOptional({ example: 'straight_line' })
  @IsOptional()
  @IsIn(['straight_line', 'declining_balance', 'none'])
  depreciationMethod?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsIn(['active', 'maintenance', 'disposed', 'sold'])
  status?: string;

  @ApiPropertyOptional({ example: 'Main Office - Room 101' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'ABCD1234EFGH' })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({ example: 'Dell' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ example: 'Latitude 5520' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  warrantyExpiry?: string;

  @ApiPropertyOptional({ example: '/uploads/asset-photo.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'Purchased for development team' })
  @IsOptional()
  @IsString()
  notes?: string;
}
