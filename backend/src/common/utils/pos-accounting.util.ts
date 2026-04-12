import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BankTransactionType, CashBookSource, CashBookType, StockLedgerType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export async function nextDocumentNo(
  tx: any,
  lockKey: string,
  model: 'sale' | 'purchase' | 'return' | 'damage' | 'estimate',
  field: 'invoiceNo' | 'returnNo' | 'damageNo' | 'estimateNo',
  prefix: string,
  sequenceWidth = 6,
) {
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

  const lastRecord = await tx[model].findFirst({
    where: { [field]: { startsWith: `${prefix}-` } },
    orderBy: { [field]: 'desc' },
    select: { [field]: true },
  });

  const lastNo = lastRecord?.[field] as string | undefined;
  const lastSequence = lastNo ? Number(lastNo.split('-').pop()) : 0;
  const nextSequence = Number.isFinite(lastSequence) ? lastSequence + 1 : 1;

  return `${prefix}-${String(nextSequence).padStart(sequenceWidth, '0')}`;
}

export async function calculateStock(tx: any, productId: string, branchId?: string): Promise<number> {
  const rows = await tx.stockLedger.findMany({
    where: { productId, ...(branchId ? { branchId } : {}) },
    select: { type: true, quantity: true },
  });

  return rows.reduce((sum: number, row: { type: StockLedgerType; quantity: number }) => {
    const quantity = Math.abs(row.quantity);
    if (row.type === StockLedgerType.OUT) return sum - quantity;
    return sum + quantity;
  }, 0);
}

export async function addCashBookEntry(
  tx: any,
  type: CashBookType,
  source: CashBookSource,
  referenceId: string,
  amount: number,
  description: string,
  branchId?: string,
) {
  const lastCashEntry = await tx.cashBook.findFirst({
    where: branchId ? { branchId } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  const previousBalance = Number(lastCashEntry?.balance) || 0;
  const balance = type === CashBookType.IN ? previousBalance + amount : previousBalance - amount;

  return tx.cashBook.create({
    data: {
      type,
      source,
      referenceId,
      branchId,
      amount: new Decimal(amount),
      balance: new Decimal(balance),
      description,
    },
  });
}

export async function recordBankTransaction(
  tx: any,
  bankAccountId: string,
  amount: number,
  type: BankTransactionType,
  referenceId: string,
  description: string,
) {
  const account = await tx.bankAccount.findFirst({ where: { id: bankAccountId, deletedAt: null } });
  if (!account) throw new NotFoundException('Bank account not found');

  const currentBalance = Number(account.currentBalance);
  if (type === BankTransactionType.WITHDRAW && currentBalance < amount) {
    throw new BadRequestException('Insufficient bank balance');
  }

  const balanceAfter = type === BankTransactionType.DEPOSIT ? currentBalance + amount : currentBalance - amount;

  await tx.bankTransaction.create({
    data: {
      bankAccountId,
      type,
      amount: new Decimal(amount),
      balanceAfter: new Decimal(balanceAfter),
      referenceId,
      description,
    },
  });

  return tx.bankAccount.update({
    where: { id: bankAccountId },
    data: { currentBalance: new Decimal(balanceAfter) },
  });
}
