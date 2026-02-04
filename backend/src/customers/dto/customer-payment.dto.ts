import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CustomerPaymentDto {
  @ApiProperty({ example: 1000.00 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({ enum: PaymentMethod, default: 'CASH' })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.CASH;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  paymentDate?: Date;
}
