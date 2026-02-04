import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CashBookService } from './cash-book.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Cash Book')
@ApiBearerAuth()
@Controller('cash-book')
export class CashBookController {
  constructor(private readonly service: CashBookService) {}

  @Get()
  @Permissions('cash_book')
  @ApiOperation({ summary: 'Get all cash book entries' })
  findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }

  @Get('balance')
  @Permissions('cash_book')
  @ApiOperation({ summary: 'Get current cash balance' })
  getBalance() { return this.service.getBalance(); }

  @Get('summary')
  @Permissions('cash_book')
  @ApiOperation({ summary: 'Get cash book summary' })
  getSummary(@Query() query: { startDate?: string; endDate?: string }) { return this.service.getSummary(query); }
}
