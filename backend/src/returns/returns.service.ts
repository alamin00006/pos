import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { CustomerLedgerType, PaymentStatus, SaleStatus, StockLedgerType, StockLedgerSource } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateReturnDto } from './dto';
import { nextDocumentNo } from '../common/utils/pos-accounting.util';

/**
 * Coordinates Returns business logic, validation, and persistence workflows.
 */
@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new Returns record after validating the request payload.
   */
  async create(dto: CreateReturnDto) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id: dto.saleId, deletedAt: null },
        include: {
          saleItems: true,
          returns: {
            where: { deletedAt: null },
            include: { returnItems: true },
          },
        },
      });
      if (!sale) throw new NotFoundException('Sale not found');
      if (sale.status === SaleStatus.REFUNDED) {
        throw new BadRequestException('Sale is already fully refunded');
      }

      const soldQty = new Map<string, number>();
      for (const item of sale.saleItems) {
        soldQty.set(item.productId, (soldQty.get(item.productId) || 0) + item.quantity);
      }

      const returnedQty = new Map<string, number>();
      for (const saleReturn of sale.returns) {
        for (const item of saleReturn.returnItems) {
          returnedQty.set(item.productId, (returnedQty.get(item.productId) || 0) + item.quantity);
        }
      }

      for (const item of dto.items) {
        const remainingQty = (soldQty.get(item.productId) || 0) - (returnedQty.get(item.productId) || 0);
        if (item.quantity > remainingQty) {
          throw new BadRequestException(`Return quantity exceeds sold quantity for product ${item.productId}`);
        }
      }

      const returnNo = await nextDocumentNo(tx, 'return_number', 'return', 'returnNo', 'RET');
      const total = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

      const returnRecord = await tx.return.create({
        data: {
          returnNo,
          saleId: dto.saleId,
          total: new Decimal(total),
          note: dto.notes || dto.reason,
          returnItems: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitPrice),
              total: new Decimal(item.quantity * item.unitPrice),
            })),
          },
        },
        include: { returnItems: { include: { product: true } }, sale: true },
      });

      for (const item of dto.items) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            type: StockLedgerType.IN,
            source: StockLedgerSource.RETURN,
            referenceId: returnRecord.id,
            quantity: item.quantity,
            note: `Return ${returnNo}`,
          },
        });
      }

      const totalReturned = await tx.return.aggregate({
        where: { saleId: sale.id, deletedAt: null },
        _sum: { total: true },
      });
      const returnedAmount = Number(totalReturned._sum.total || 0);
      const effectiveSaleTotal = Math.max(0, Number(sale.total) - returnedAmount);
      const newPaidAmount = Math.min(Number(sale.paidAmount), effectiveSaleTotal);
      const newDueAmount = Math.max(0, effectiveSaleTotal - newPaidAmount);
      const paymentStatus =
        newDueAmount <= 0 ? PaymentStatus.PAID : newPaidAmount > 0 ? PaymentStatus.PARTIAL : PaymentStatus.PENDING;

      await tx.sale.update({
        where: { id: sale.id },
        data: {
          paidAmount: new Decimal(newPaidAmount),
          dueAmount: new Decimal(newDueAmount),
          paymentStatus,
          status: returnedAmount >= Number(sale.total) ? SaleStatus.REFUNDED : sale.status,
        },
      });

      if (sale.customerId) {
        const lastLedger = await tx.customerLedger.findFirst({
          where: { customerId: sale.customerId },
          orderBy: { createdAt: 'desc' },
        });
        const previousBalance = Number(lastLedger?.balance) || 0;
        await tx.customerLedger.create({
          data: {
            customerId: sale.customerId,
            type: CustomerLedgerType.RETURN_ADJUST,
            referenceId: returnRecord.id,
            amount: new Decimal(total),
            balance: new Decimal(previousBalance - total),
            note: `Return adjustment - ${returnNo}`,
          },
        });
      }

      return returnRecord;
    });
  }

  /**
   * Retrieves filtered Returns records for API consumers.
   */
  async findAll(query: PaginationDto & Record<string, any>) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
      saleId,
      customerId,
    } = query;
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { returnNo: { contains: search, mode: 'insensitive' } },
        { sale: { invoiceNo: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (saleId) {
      where.OR = [
        ...(where.OR || []),
        { saleId },
        { sale: { invoiceNo: { contains: saleId, mode: 'insensitive' } } },
      ];
    }
    if (customerId) {
      where.sale = { ...(where.sale || {}), customerId };
    }
    if (startDate || endDate) {
      where.returnDate = {};
      if (startDate) where.returnDate.gte = new Date(startDate);
      if (endDate) where.returnDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.return.findMany({
        where,
        include: {
          sale: { include: { customer: true } },
          returnItems: { include: { product: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.return.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  /**
   * Retrieves a single Returns record by identifier.
   */
  async findOne(id: string) {
    const returnRecord = await this.prisma.return.findFirst({
      where: { id, deletedAt: null },
      include: { sale: true, returnItems: { include: { product: true } } },
    });
    if (!returnRecord) throw new NotFoundException('Return not found');
    return returnRecord;
  }

  /**
   * Removes an existing Returns record while preserving business consistency.
   */
  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const returnRecord = await tx.return.findFirst({
        where: { id, deletedAt: null },
        include: {
          returnItems: true,
          sale: true,
        },
      });
      if (!returnRecord) throw new NotFoundException('Return not found');

      for (const item of returnRecord.returnItems) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            type: StockLedgerType.OUT,
            source: StockLedgerSource.ADJUSTMENT,
            referenceId: returnRecord.id,
            quantity: item.quantity,
            note: `Return delete reversal - ${returnRecord.returnNo}`,
          },
        });
      }

      await tx.return.update({ where: { id }, data: { deletedAt: new Date() } });

      const totalReturned = await tx.return.aggregate({
        where: { saleId: returnRecord.saleId, deletedAt: null },
        _sum: { total: true },
      });
      const returnedAmount = Number(totalReturned._sum.total || 0);
      const effectiveSaleTotal = Math.max(0, Number(returnRecord.sale.total) - returnedAmount);
      const newPaidAmount = Math.min(Number(returnRecord.sale.paidAmount), effectiveSaleTotal);
      const newDueAmount = Math.max(0, effectiveSaleTotal - newPaidAmount);
      const paymentStatus =
        newDueAmount <= 0 ? PaymentStatus.PAID : newPaidAmount > 0 ? PaymentStatus.PARTIAL : PaymentStatus.PENDING;

      await tx.sale.update({
        where: { id: returnRecord.saleId },
        data: {
          paidAmount: new Decimal(newPaidAmount),
          dueAmount: new Decimal(newDueAmount),
          paymentStatus,
          status: returnRecord.sale.status === SaleStatus.REFUNDED ? SaleStatus.COMPLETED : returnRecord.sale.status,
        },
      });

      if (returnRecord.sale.customerId) {
        const lastLedger = await tx.customerLedger.findFirst({
          where: { customerId: returnRecord.sale.customerId },
          orderBy: { createdAt: 'desc' },
        });
        const previousBalance = Number(lastLedger?.balance) || 0;
        await tx.customerLedger.create({
          data: {
            customerId: returnRecord.sale.customerId,
            type: CustomerLedgerType.SALE_DUE,
            referenceId: returnRecord.id,
            amount: returnRecord.total,
            balance: new Decimal(previousBalance + Number(returnRecord.total)),
            note: `Return delete ledger reversal - ${returnRecord.returnNo}`,
          },
        });
      }

      return { message: 'Return deleted successfully' };
    });
  }
}
