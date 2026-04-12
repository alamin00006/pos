import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.employee.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        nid: dto.nid,
        ...(dto.nidNumber ? { nid: dto.nidNumber } : {}),
        designation: dto.designation,
        department: dto.department,
        joinDate: dto.joinDate || dto.joiningDate ? new Date(dto.joinDate || dto.joiningDate) : new Date(),
        basicSalary: new Decimal(dto.basicSalary || dto.salary || 0),
        image: dto.image || dto.photo,
      },
    });
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = query;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        include: { _count: { select: { salaryPayments: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.employee.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, deletedAt: null },
      include: { salaryPayments: { orderBy: { paymentDate: 'desc' }, take: 12 } },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    const data = { ...dto };
    if (data.nidNumber) {
      data.nid = data.nidNumber;
      delete data.nidNumber;
    }
    if (data.joiningDate) {
      data.joinDate = new Date(data.joiningDate);
      delete data.joiningDate;
    }
    if (data.salary !== undefined) {
      data.basicSalary = new Decimal(data.salary);
      delete data.salary;
    }
    if (data.photo) {
      data.image = data.photo;
      delete data.photo;
    }
    delete data.status;
    delete data.employeeId;
    delete data.emergencyContact;
    delete data.notes;
    return this.prisma.employee.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.employee.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
