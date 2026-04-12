import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDateString,
  Min,
  IsIn,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Office Supplies' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 250.50 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: 'cash' })
  @IsOptional()
  @IsIn(['cash', 'bank', 'card', 'cheque', 'mobile_money', 'mobile_payment', 'other'])
  paymentMethod?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  bankAccountId?: string;

  @ApiPropertyOptional({ example: 'EXP-001' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: 'Purchased stationery and printer ink' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '/uploads/receipt.jpg' })
  @IsOptional()
  @IsString()
  attachment?: string;
}
