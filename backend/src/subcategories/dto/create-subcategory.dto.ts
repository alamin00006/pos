import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Smartphones' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'SMART' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'Mobile smartphones' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Parent category ID' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
