import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, IsOptional, IsString, IsArray, ValidateNested, IsUUID } from 'class-validator';

export class RefundItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity to refund' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Unit price' })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class RefundSaleDto {
  @ApiProperty({ type: [RefundItemDto], description: 'Items to refund' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RefundItemDto)
  items: RefundItemDto[];

  @ApiPropertyOptional({ description: 'Refund note' })
  @IsOptional()
  @IsString()
  note?: string;
}
