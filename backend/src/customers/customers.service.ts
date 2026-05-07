import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerPaymentDto } from './dto/customer-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, buildPaginationQuery, buildOrderByQuery, buildSearchQuery } from '../common/utils/pagination.util';
import { CustomerLedgerType, CashBookType, CashBookSource } from '@prisma/client';

/**
 * Coordinates Customers business logic, validation, and persistence workflows.
 */
@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves filtered Customers records for API consumers.
   */
  async findAll(query: PaginationDto, branchId?: string) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const where = { ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}), ...buildSearchQuery(search, ['name', 'email', 'phone']) };
    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({ where, skip, take, orderBy: buildOrderByQuery(sortBy, sortOrder) }),
      this.prisma.customer.count({ where }),
    ]);
    const customersWithDue = await Promise.all(customers.map(async (c) => ({ ...c, due: await this.calculateDue(c.id) })));
    return paginate(customersWithDue, total, page!, limit!);
  }

  /**
   * Builds the requested Customers report from current business data.
   */
  async getDueReport(query: PaginationDto, branchId?: string) {
    const { page, limit } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const customers = await this.prisma.customer.findMany({ where: { ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}) } });
    const customersWithDue = (await Promise.all(customers.map(async (c) => ({ ...c, due: await this.calculateDue(c.id) })))).filter((c) => c.due > 0);
    return paginate(customersWithDue.slice(skip, skip + take), customersWithDue.length, page!, limit!);
  }

  /**
   * Retrieves a single Customers record by identifier.
   */
  async findOne(id: string, branchId?: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, ...this.prisma.notDeleted(), ...(branchId ? { branchId } : {}) } });
    if (!customer) throw new NotFoundException('Customer not found');
    return { ...customer, due: await this.calculateDue(id) };
  }

  /**
   * Handles the get ledger workflow for Customers records.
   */
  async getLedger(id: string, query: PaginationDto) {
    const { page, limit } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    await this.findOne(id);
    const [ledger, total] = await Promise.all([
      this.prisma.customerLedger.findMany({ where: { customerId: id }, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.customerLedger.count({ where: { customerId: id } }),
    ]);
    return paginate(ledger, total, page!, limit!);
  }

  /**
   * Creates a new Customers record after validating the request payload.
   */
  async create(dto: CreateCustomerDto, userId?: string, branchId?: string) {
    const customer = await this.prisma.customer.create({ data: { ...dto, createdById: userId, branchId } as any });
    if (dto.openingBalance && Number(dto.openingBalance) > 0) {
      await this.prisma.customerLedger.create({ data: { customerId: customer.id, type: CustomerLedgerType.OPENING_BALANCE, amount: dto.openingBalance, balance: dto.openingBalance, note: 'Opening balance' } });
    }
    return customer;
  }

  /**
   * Updates an existing Customers record with the provided changes.
   */
  async update(id: string, dto: UpdateCustomerDto) { await this.findOne(id); return this.prisma.customer.update({ where: { id }, data: dto }); }
  /**
   * Removes an existing Customers record while preserving business consistency.
   */
  async remove(id: string) { await this.findOne(id); await this.prisma.customer.update({ where: { id }, data: this.prisma.softDelete() }); return { message: 'Customer deleted successfully' }; }

  /**
   * Processes payment changes and keeps related ledgers in sync.
   */
  async makePayment(customerId: string, dto: CustomerPaymentDto) {
    const customer = await this.findOne(customerId);
    const currentDue = await this.calculateDue(customerId);
    await this.prisma.customerPayment.create({ data: { customerId, amount: dto.amount, paymentMethod: dto.paymentMethod, note: dto.note, paymentDate: dto.paymentDate || new Date() } });
    const newBalance = currentDue - Number(dto.amount);
    await this.prisma.customerLedger.create({ data: { customerId, type: CustomerLedgerType.PAYMENT, amount: dto.amount, balance: newBalance, note: dto.note || 'Payment received' } });
    if (dto.paymentMethod === 'CASH') {
      const lastEntry = await this.prisma.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
      await this.prisma.cashBook.create({ data: { type: CashBookType.IN, source: CashBookSource.PAYMENT_RECEIVED, referenceId: customerId, amount: dto.amount, balance: (Number(lastEntry?.balance) || 0) + Number(dto.amount), description: `Payment from customer: ${customer.name}` } });
    }
    return { message: 'Payment recorded successfully', newDue: newBalance };
  }

  /**
   * Creates a new Customers record after validating the request payload.
   */
  async addSaleDue(customerId: string, amount: number, referenceId: string) {
    const currentDue = await this.calculateDue(customerId);
    await this.prisma.customerLedger.create({ data: { customerId, type: CustomerLedgerType.SALE_DUE, referenceId, amount, balance: currentDue + amount, note: 'Sale due' } });
  }

  /**
   * Handles the calculate due workflow for Customers records.
   */
  private async calculateDue(customerId: string): Promise<number> {
    const ledger = await this.prisma.customerLedger.findMany({ where: { customerId }, orderBy: { createdAt: 'desc' }, take: 1 });
    return Number(ledger[0]?.balance) || 0;
  }
}
