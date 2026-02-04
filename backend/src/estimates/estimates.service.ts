import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) {}

  private async generateEstimateNo(): Promise<string> {
    const today = new Date();
    const prefix = `EST${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    const lastEstimate = await this.prisma.estimate.findFirst({
      where: { estimateNo: { startsWith: prefix } },
      orderBy: { estimateNo: 'desc' },
    });
    let sequence = 1;
    if (lastEstimate) sequence = parseInt(lastEstimate.estimateNo.slice(-4)) + 1;
    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }

  async create(dto: any) {
    const estimateNo = await this.generateEstimateNo();
    const subtotal = dto.items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);
    const total = subtotal - (dto.discount || 0) + (dto.tax || 0);

    return this.prisma.estimate.create({
      data: {
        estimateNo,
        customerId: dto.customerId,
        subtotal: new Decimal(subtotal),
        discount: new Decimal(dto.discount || 0),
        tax: new Decimal(dto.tax || 0),
        total: new Decimal(total),
        note: dto.note,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        estimateItems: {
          create: dto.items.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: new Decimal(item.unitPrice),
            total: new Decimal(item.quantity * item.unitPrice),
          })),
        },
      },
      include: { customer: true, estimateItems: true },
    });
  }

  async findAll(query: PaginationDto & { customerId?: string }) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', customerId } = query;
    const where: any = { deletedAt: null };
    if (search) where.estimateNo = { contains: search, mode: 'insensitive' };
    if (customerId) where.customerId = customerId;

    const [data, total] = await Promise.all([
      this.prisma.estimate.findMany({
        where,
        include: { customer: true, estimateItems: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.estimate.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const estimate = await this.prisma.estimate.findUnique({
      where: { id, deletedAt: null },
      include: { customer: true, estimateItems: true },
    });
    if (!estimate) throw new NotFoundException('Estimate not found');
    return estimate;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.estimate.update({
      where: { id },
      data: { note: dto.note, validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined },
      include: { customer: true, estimateItems: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.estimate.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
