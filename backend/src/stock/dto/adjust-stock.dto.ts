import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsIn, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AdjustStockDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ enum: ['IN', 'OUT'] })
  @IsIn(['IN', 'OUT'])
  type: 'IN' | 'OUT';

  @ApiPropertyOptional({ example: 'Stock adjustment for inventory count' })
  @IsOptional()
  @IsString()
  note?: string;
}
