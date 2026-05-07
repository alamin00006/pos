import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { BankAccountsService } from './bank-accounts.service';
import { Permissions } from '../common/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  CreateBankAccountDto,
  UpdateBankAccountDto,
  DepositDto,
  WithdrawDto,
  TransferDto,
} from './dto';

/**
 * Exposes HTTP endpoints for Bank Accounts operations.
 */
@ApiTags('Bank Accounts')
@ApiBearerAuth()
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly service: BankAccountsService) {}

  /**
   * Create bank account.
   */
  @Post()
  @Permissions('add_bank_account')
  @ApiOperation({ summary: 'Create bank account' })
  create(@Body() dto: CreateBankAccountDto) {
    return this.service.create(dto);
  }

  /**
   * Get all bank accounts.
   */
  @Get()
  @Permissions('bank_account_list')
  @ApiOperation({ summary: 'Get all bank accounts' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  /**
   * Get bank account by ID.
   */
  @Get(':id')
  @Permissions('bank_account_list')
  @ApiOperation({ summary: 'Get bank account by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Update bank account.
   */
  @Patch(':id')
  @Permissions('add_bank_account')
  @ApiOperation({ summary: 'Update bank account' })
  update(@Param('id') id: string, @Body() dto: UpdateBankAccountDto) {
    return this.service.update(id, dto);
  }

  /**
   * Deposit to bank account.
   */
  @Post(':id/deposit')
  @Permissions('create_bank_deposit')
  @ApiOperation({ summary: 'Deposit to bank account' })
  deposit(@Param('id') id: string, @Body() dto: DepositDto) {
    return this.service.deposit(id, dto);
  }

  /**
   * Withdraw from bank account.
   */
  @Post(':id/withdraw')
  @Permissions('bank_account_withdraw')
  @ApiOperation({ summary: 'Withdraw from bank account' })
  withdraw(@Param('id') id: string, @Body() dto: WithdrawDto) {
    return this.service.withdraw(id, dto);
  }

  /**
   * Transfer between bank accounts.
   */
  @Post(':id/transfer')
  @Permissions('bank_account_transfer')
  @ApiOperation({ summary: 'Transfer between bank accounts' })
  transfer(@Param('id') id: string, @Body() dto: TransferDto) {
    return this.service.transfer(id, dto);
  }

  /**
   * Delete bank account.
   */
  @Delete(':id')
  @Permissions('bank_account_delete')
  @ApiOperation({ summary: 'Delete bank account' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
