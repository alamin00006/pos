import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  Min,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {
  @ApiProperty({ example: "iPhone 15 Pro" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "PRD-001" })
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @ApiPropertyOptional({ example: "8901234567890" })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ example: "Latest iPhone model with A17 chip" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1200.0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  costPrice: number;

  @ApiProperty({ example: 1499.0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  sellPrice: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  alertQuantity?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  subcategoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  unitId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  openingStock?: number;
}
