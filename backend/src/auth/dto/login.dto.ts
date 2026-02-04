import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@softghor.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;
}
