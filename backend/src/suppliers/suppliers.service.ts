import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierPaymentDto } from './dto/supplier-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';
import { SupplierLedgerType, CashBookType, CashBookSource } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto, branchId?: string) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ['name', 'email', 'phone', 'company']);

    const where = {
      ...this.prisma.notDeleted(),
      ...(branchId ? { branchId } : {}),
      ...searchQuery,
    };

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.supplier.count({ where }),
    ]);

    // Calculate due for each supplier
    const suppliersWithDue = await Promise.all(
      suppliers.map(async (supplier) => {
        const due = await this.calculateDue(supplier.id);
        return { ...supplier, due };
      }),
    );

    return paginate(suppliersWithDue, total, page!, limit!);
  }

  async getDueReport(query: PaginationDto, branchId?: string) {
    const { page, limit } = query;
    const { skip, take } = buildPaginationQuery(page, limit);

    const suppliers = await this.prisma.supplier.findMany({
      where: { ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}) },
    });

    const suppliersWithDue = await Promise.all(
      suppliers.map(async (supplier) => {
        const due = await this.calculateDue(supplier.id);
        return { ...supplier, due };
      }),
    );

    // Filter suppliers with due > 0
    const suppliersWithPositiveDue = suppliersWithDue.filter((s) => s.due > 0);
    const paginatedSuppliers = suppliersWithPositiveDue.slice(skip, skip + take);

    return paginate(paginatedSuppliers, suppliersWithPositiveDue.length, page!, limit!);
  }

  async findOne(id: string, branchId?: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}) },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const due = await this.calculateDue(id);
    return { ...supplier, due };
  }

  async getLedger(id: string, query: PaginationDto) {
    const { page, limit } = query;
    const { skip, take } = buildPaginationQuery(page, limit);

    await this.findOne(id);

    const [ledger, total] = await Promise.all([
      this.prisma.supplierLedger.findMany({
        where: { supplierId: id },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.supplierLedger.count({ where: { supplierId: id } }),
    ]);

    return paginate(ledger, total, page!, limit!);
  }

  async create(createSupplierDto: CreateSupplierDto, userId?: string, branchId?: string) {
    const supplier = await this.prisma.supplier.create({
      data: {
        ...createSupplierDto,
        createdById: userId,
        branchId,
      },
    });

    // Create opening balance ledger entry if exists
    if (createSupplierDto.openingBalance && Number(createSupplierDto.openingBalance) > 0) {
      await this.prisma.supplierLedger.create({
        data: {
          supplierId: supplier.id,
          type: SupplierLedgerType.OPENING_BALANCE,
          amount: createSupplierDto.openingBalance,
          balance: createSupplierDto.openingBalance,
          note: 'Opening balance',
        },
      });
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    await this.findOne(id);
    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.supplier.update({
      where: { id },
      data: this.prisma.softDelete(),
    });
    return { message: 'Supplier deleted successfully' };
  }

  async makePayment(supplierId: string, paymentDto: SupplierPaymentDto) {
    const supplier = await this.findOne(supplierId);
    const currentDue = await this.calculateDue(supplierId);

    // Create payment record
    await this.prisma.supplierPayment.create({
      data: {
        supplierId,
        amount: paymentDto.amount,
        paymentMethod: paymentDto.paymentMethod,
        note: paymentDto.note,
        paymentDate: paymentDto.paymentDate || new Date(),
      },
    });

    // Create ledger entry
    const newBalance = currentDue - Number(paymentDto.amount);
    await this.prisma.supplierLedger.create({
      data: {
        supplierId,
        type: SupplierLedgerType.PAYMENT,
        amount: paymentDto.amount,
        balance: newBalance,
        note: paymentDto.note || 'Payment made',
      },
    });

    // Create cash book entry if cash payment
    if (paymentDto.paymentMethod === 'CASH') {
      const lastCashEntry = await this.prisma.cashBook.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      await this.prisma.cashBook.create({
        data: {
          type: CashBookType.OUT,
          source: CashBookSource.PAYMENT_MADE,
          referenceId: supplierId,
          amount: paymentDto.amount,
          balance: (Number(lastCashEntry?.balance) || 0) - Number(paymentDto.amount),
          description: `Payment to supplier: ${supplier.name}`,
        },
      });
    }

    return { message: 'Payment recorded successfully', newDue: newBalance };
  }

  // Used by purchase service
  async addPurchaseDue(supplierId: string, amount: number, referenceId: string) {
    const currentDue = await this.calculateDue(supplierId);
    const newBalance = currentDue + amount;

    await this.prisma.supplierLedger.create({
      data: {
        supplierId,
        type: SupplierLedgerType.PURCHASE_DUE,
        referenceId,
        amount,
        balance: newBalance,
        note: 'Purchase due',
      },
    });
  }

  private async calculateDue(supplierId: string): Promise<number> {
    const ledger = await this.prisma.supplierLedger.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    return Number(ledger[0]?.balance) || 0;
  }
}
