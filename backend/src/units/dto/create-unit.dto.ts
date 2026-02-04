import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({ example: 'Kilogram' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({ example: 1000, description: 'Conversion rate to base unit' })
  @IsOptional()
  @IsNumber()
  conversionRate?: number;

  @ApiPropertyOptional({ example: 'Gram' })
  @IsOptional()
  @IsString()
  baseUnit?: string;
}
