import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { StockLedgerType, StockLedgerSource } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  private async generateReturnNo(): Promise<string> {
    const today = new Date();
    const prefix = `RET${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    const lastReturn = await this.prisma.return.findFirst({
      where: { returnNo: { startsWith: prefix } },
      orderBy: { returnNo: 'desc' },
    });
    let sequence = 1;
    if (lastReturn) {
      const lastSeq = parseInt(lastReturn.returnNo.slice(-4));
      sequence = lastSeq + 1;
    }
    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }

  async create(dto: any) {
    const sale = await this.prisma.sale.findUnique({
      where: { id: dto.saleId, deletedAt: null },
    });
    if (!sale) throw new NotFoundException('Sale not found');

    const returnNo = await this.generateReturnNo();
    const total = dto.items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);

    return this.prisma.$transaction(async (tx) => {
      const returnRecord = await tx.return.create({
        data: {
          returnNo,
          saleId: dto.saleId,
          total: new Decimal(total),
          note: dto.note,
          returnItems: {
            create: dto.items.map((item: any) => ({
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

      return returnRecord;
    });
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { returnNo: { contains: search, mode: 'insensitive' } },
        { sale: { invoiceNo: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.return.findMany({
        where,
        include: { sale: true, returnItems: { include: { product: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.return.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const returnRecord = await this.prisma.return.findUnique({
      where: { id, deletedAt: null },
      include: { sale: true, returnItems: { include: { product: true } } },
    });
    if (!returnRecord) throw new NotFoundException('Return not found');
    return returnRecord;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.return.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
