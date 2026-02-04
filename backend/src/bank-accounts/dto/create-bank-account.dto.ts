import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({ example: 'Main Business Account' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Bank of America' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  accountHolder?: string;

  @ApiPropertyOptional({ example: 'BOFAUS3N' })
  @IsOptional()
  @IsString()
  swiftCode?: string;

  @ApiPropertyOptional({ example: '021000322' })
  @IsOptional()
  @IsString()
  routingNumber?: string;

  @ApiPropertyOptional({ example: 10000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  openingBalance?: number;

  @ApiPropertyOptional({ example: 'Primary business checking account' })
  @IsOptional()
  @IsString()
  description?: string;
}
