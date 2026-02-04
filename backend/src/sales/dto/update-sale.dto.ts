import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { SaleStatus, PaymentStatus } from '@prisma/client';

export class UpdateSaleDto extends PartialType(OmitType(CreateSaleDto, ['items'] as const)) {
  @ApiPropertyOptional({ enum: SaleStatus })
  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
