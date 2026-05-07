import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class SupplierPaymentDto {
  @ApiProperty({
    example: 5000.00,
    description: 'Amount paid to the supplier. Must not exceed the current supplier due.',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
    description: 'Payment channel used for this supplier payment.',
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.CASH;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Required when paymentMethod is CARD, BANK_TRANSFER, MOBILE_PAYMENT, CHEQUE, or OTHER.',
  })
  @IsOptional()
  @IsUUID()
  bankAccountId?: string;

  @ApiPropertyOptional({
    example: 'Monthly payment',
    description: 'Internal note shown in supplier ledger and payment history.',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    example: '2026-05-07',
    description: 'Payment date. Defaults to the current date when omitted.',
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: Date;
}
