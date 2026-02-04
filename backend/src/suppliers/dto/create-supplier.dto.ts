import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSupplierDto {
  @ApiProperty({ example: 'ABC Supplies' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'contact@abcsupplies.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '01712345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Industrial Area, Dhaka' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'ABC Trading Co.' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 5000.00 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  openingBalance?: number;
}
