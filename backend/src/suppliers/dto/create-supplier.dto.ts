import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSupplierDto {
  @ApiProperty({
    example: 'ABC Supplies',
    description: 'Supplier display name used in purchases, ledgers, and reports.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'contact@abcsupplies.com',
    description: 'Supplier contact email address.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '01712345678',
    description: 'Primary supplier phone number.',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: '123 Industrial Area, Dhaka',
    description: 'Supplier business or billing address.',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'ABC Trading Co.',
    description: 'Registered company or trading name.',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    example: 5000.00,
    description: 'Initial payable balance to seed the supplier ledger.',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  openingBalance?: number;
}
