import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, ValidateNested, IsEnum, Min, IsDateString, IsUUID } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateSaleItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity sold' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Unit price' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Item discount amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

export class CreateSalePaymentDto {
  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ enum: PaymentMethod, default: PaymentMethod.CASH })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Payment note' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateSaleDto {
  @ApiPropertyOptional({ description: 'Customer ID (optional for walk-in)' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ type: [CreateSaleItemDto], description: 'Sale items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];

  @ApiPropertyOptional({ description: 'Discount amount or percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiPropertyOptional({ description: 'Discount type: fixed or percentage', default: 'fixed' })
  @IsOptional()
  @IsString()
  discountType?: string;

  @ApiPropertyOptional({ description: 'Tax amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @ApiPropertyOptional({ type: [CreateSalePaymentDto], description: 'Payments for the sale' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalePaymentDto)
  payments?: CreateSalePaymentDto[];

  @ApiPropertyOptional({ enum: PaymentMethod, default: PaymentMethod.CASH })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Sale note' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Sale date' })
  @IsOptional()
  @IsDateString()
  saleDate?: string;
}
