import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { BankTransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BankAccountsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.bankAccount.create({
      data: {
        bankName: dto.bankName,
        accountName: dto.accountName,
        accountNumber: dto.accountNumber,
        branch: dto.branch,
        openingBalance: new Decimal(dto.openingBalance || 0),
        currentBalance: new Decimal(dto.openingBalance || 0),
      },
    });
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { bankName: { contains: search, mode: 'insensitive' } },
        { accountName: { contains: search, mode: 'insensitive' } },
        { accountNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.bankAccount.findMany({
        where,
        include: { _count: { select: { transactions: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.bankAccount.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id, deletedAt: null },
      include: { transactions: { orderBy: { transactionDate: 'desc' }, take: 50 } },
    });

    if (!account) throw new NotFoundException('Bank account not found');
    return account;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.bankAccount.update({
      where: { id },
      data: dto,
    });
  }

  async deposit(id: string, dto: any) {
    const account = await this.findOne(id);
    const newBalance = Number(account.currentBalance) + dto.amount;

    return this.prisma.$transaction(async (tx) => {
      await tx.bankTransaction.create({
        data: {
          bankAccountId: id,
          type: BankTransactionType.DEPOSIT,
          amount: new Decimal(dto.amount),
          balanceAfter: new Decimal(newBalance),
          description: dto.description,
        },
      });

      return tx.bankAccount.update({
        where: { id },
        data: { currentBalance: new Decimal(newBalance) },
      });
    });
  }

  async withdraw(id: string, dto: any) {
    const account = await this.findOne(id);
    if (Number(account.currentBalance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }
    const newBalance = Number(account.currentBalance) - dto.amount;

    return this.prisma.$transaction(async (tx) => {
      await tx.bankTransaction.create({
        data: {
          bankAccountId: id,
          type: BankTransactionType.WITHDRAW,
          amount: new Decimal(dto.amount),
          balanceAfter: new Decimal(newBalance),
          description: dto.description,
        },
      });

      return tx.bankAccount.update({
        where: { id },
        data: { currentBalance: new Decimal(newBalance) },
      });
    });
  }

  async transfer(fromId: string, dto: any) {
    const fromAccount = await this.findOne(fromId);
    const toAccount = await this.findOne(dto.toAccountId);

    if (Number(fromAccount.currentBalance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const fromNewBalance = Number(fromAccount.currentBalance) - dto.amount;
    const toNewBalance = Number(toAccount.currentBalance) + dto.amount;

    return this.prisma.$transaction(async (tx) => {
      await tx.bankTransaction.create({
        data: {
          bankAccountId: fromId,
          type: BankTransactionType.TRANSFER_OUT,
          amount: new Decimal(dto.amount),
          balanceAfter: new Decimal(fromNewBalance),
          referenceId: dto.toAccountId,
          description: `Transfer to ${toAccount.accountName}`,
        },
      });

      await tx.bankTransaction.create({
        data: {
          bankAccountId: dto.toAccountId,
          type: BankTransactionType.TRANSFER_IN,
          amount: new Decimal(dto.amount),
          balanceAfter: new Decimal(toNewBalance),
          referenceId: fromId,
          description: `Transfer from ${fromAccount.accountName}`,
        },
      });

      await tx.bankAccount.update({
        where: { id: fromId },
        data: { currentBalance: new Decimal(fromNewBalance) },
      });

      return tx.bankAccount.update({
        where: { id: dto.toAccountId },
        data: { currentBalance: new Decimal(toNewBalance) },
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.bankAccount.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
