import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { CashBookType, CashBookSource } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const employee = await this.prisma.employee.findUnique({ where: { id: dto.employeeId, deletedAt: null } });
    if (!employee) throw new NotFoundException('Employee not found');

    const existing = await this.prisma.salaryPayment.findUnique({
      where: { employeeId_month_year: { employeeId: dto.employeeId, month: dto.month, year: dto.year } },
    });
    if (existing) throw new BadRequestException('Salary already paid for this month');

    const basicSalary = dto.basicSalary || Number(employee.basicSalary);
    const netSalary = basicSalary + (dto.overtime || 0) + (dto.bonus || 0) - (dto.deduction || 0);

    return this.prisma.$transaction(async (tx) => {
      const salary = await tx.salaryPayment.create({
        data: {
          employeeId: dto.employeeId,
          basicSalary: new Decimal(basicSalary),
          overtime: new Decimal(dto.overtime || 0),
          bonus: new Decimal(dto.bonus || 0),
          deduction: new Decimal(dto.deduction || 0),
          netSalary: new Decimal(netSalary),
          paymentMethod: dto.paymentMethod,
          month: dto.month,
          year: dto.year,
          note: dto.note,
        },
        include: { employee: true },
      });

      const lastCashBook = await tx.cashBook.findFirst({ orderBy: { createdAt: 'desc' } });
      const cashBalance = lastCashBook?.balance || new Decimal(0);

      await tx.cashBook.create({
        data: {
          type: CashBookType.OUT,
          source: CashBookSource.OTHER,
          referenceId: salary.id,
          amount: new Decimal(netSalary),
          balance: new Decimal(Number(cashBalance) - netSalary),
          description: `Salary payment - ${employee.name} (${dto.month}/${dto.year})`,
        },
      });

      return salary;
    });
  }

  async findAll(query: PaginationDto & { employeeId?: string; month?: number; year?: number }) {
    const { page = 1, limit = 10, sortBy = 'paymentDate', sortOrder = 'desc', employeeId, month, year } = query;
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (month) where.month = month;
    if (year) where.year = year;

    const [data, total] = await Promise.all([
      this.prisma.salaryPayment.findMany({
        where,
        include: { employee: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.salaryPayment.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const salary = await this.prisma.salaryPayment.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!salary) throw new NotFoundException('Salary payment not found');
    return salary;
  }
}
