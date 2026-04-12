import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CashBookService } from './cash-book.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { IsDateString, IsIn, IsOptional } from 'class-validator';

class CashBookQueryDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(['IN', 'OUT'])
  type?: string;

  @IsOptional()
  source?: string;
}

class CashBookSummaryQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@ApiTags('Cash Book')
@ApiBearerAuth()
@Controller('cash-book')
export class CashBookController {
  constructor(private readonly service: CashBookService) {}

  @Get()
  @Permissions('cash_book')
  @ApiOperation({ summary: 'Get all cash book entries' })
  findAll(@Query() query: CashBookQueryDto) { return this.service.findAll(query); }

  @Get('balance')
  @Permissions('cash_book')
  @ApiOperation({ summary: 'Get current cash balance' })
  getBalance() { return this.service.getBalance(); }

  @Get('summary')
  @Permissions('cash_book')
  @ApiOperation({ summary: 'Get cash book summary' })
  getSummary(@Query() query: CashBookSummaryQueryDto) { return this.service.getSummary(query); }
}
