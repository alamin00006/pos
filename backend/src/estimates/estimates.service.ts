import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { Decimal } from '@prisma/client/runtime/library';
import { nextDocumentNo } from '../common/utils/pos-accounting.util';
import { CreateEstimateDto } from './dto';

/**
 * Coordinates Estimates business logic, validation, and persistence workflows.
 */
@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new Estimates record after validating the request payload.
   */
  async create(dto: CreateEstimateDto) {
    const subtotal = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice - (item.discount || 0), 0);
    const discountAmount = dto.discountType === 'percentage' && dto.discount
      ? (subtotal * dto.discount) / 100
      : dto.discount || 0;
    const taxAmount = dto.taxRate ? ((subtotal - discountAmount) * dto.taxRate) / 100 : 0;
    const total = subtotal - discountAmount + taxAmount + (dto.shippingCost || 0);

    return this.prisma.$transaction(async (tx) => {
      const estimateNo = await nextDocumentNo(tx, 'estimate_number', 'estimate', 'estimateNo', 'EST');
      const productIds = [...new Set(dto.items.map((item) => item.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, deletedAt: null },
        select: { id: true, name: true },
      });
      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products not found');
      }
      const productNameById = new Map(products.map((product) => [product.id, product.name]));

      return tx.estimate.create({
        data: {
          estimateNo,
          customerId: dto.customerId,
          subtotal: new Decimal(subtotal),
          discount: new Decimal(discountAmount),
          tax: new Decimal(taxAmount),
          total: new Decimal(total),
          note: dto.notes || dto.terms,
          validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
          estimateItems: {
            create: dto.items.map((item) => ({
              productName: productNameById.get(item.productId) || item.productId,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitPrice),
              total: new Decimal(item.quantity * item.unitPrice - (item.discount || 0)),
            })),
          },
        },
        include: { customer: true, estimateItems: true },
      });
    });
  }

  /**
   * Retrieves filtered Estimates records for API consumers.
   */
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

  /**
   * Retrieves a single Estimates record by identifier.
   */
  async findOne(id: string) {
    const estimate = await this.prisma.estimate.findFirst({
      where: { id, deletedAt: null },
      include: { customer: true, estimateItems: true },
    });
    if (!estimate) throw new NotFoundException('Estimate not found');
    return estimate;
  }

  /**
   * Updates an existing Estimates record with the provided changes.
   */
  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.estimate.update({
      where: { id },
      data: { note: dto.note, validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined },
      include: { customer: true, estimateItems: true },
    });
  }

  /**
   * Removes an existing Estimates record while preserving business consistency.
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.estimate.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
