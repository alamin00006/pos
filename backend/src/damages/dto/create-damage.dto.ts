import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
  Min,
  IsDateString,
} from 'class-validator';

export class DamageItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitCost?: number;

  @ApiPropertyOptional({ example: 'Water damage' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateDamageDto {
  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ type: [DamageItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DamageItemDto)
  items: DamageItemDto[];

  @ApiPropertyOptional({ example: 'Warehouse flooding incident' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Items found during inventory audit' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: '/uploads/damage-photo.jpg' })
  @IsOptional()
  @IsString()
  attachment?: string;
}
