import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ example: 'Monthly revenue deposit' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'DEP-001' })
  @IsOptional()
  @IsString()
  reference?: string;
}

export class WithdrawDto {
  @ApiProperty({ example: 2000 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ example: 'Office supplies purchase' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'WD-001' })
  @IsOptional()
  @IsString()
  reference?: string;
}

export class TransferDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  toAccountId: string;

  @ApiProperty({ example: 3000 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ example: 'Transfer to savings account' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'TRF-001' })
  @IsOptional()
  @IsString()
  reference?: string;
}
