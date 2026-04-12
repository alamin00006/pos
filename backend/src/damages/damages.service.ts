import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { StockLedgerType, StockLedgerSource } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateDamageDto } from './dto';
import { calculateStock, nextDocumentNo } from '../common/utils/pos-accounting.util';

@Injectable()
export class DamagesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDamageDto) {
    const total = dto.items.reduce((sum, item) => sum + item.quantity * (item.unitCost || 0), 0);

    return this.prisma.$transaction(async (tx) => {
      const damageNo = await nextDocumentNo(tx, 'damage_number', 'damage', 'damageNo', 'DMG');
      const productIds = [...new Set(dto.items.map((item) => item.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, ...this.prisma.notDeleted() },
        select: { id: true, name: true },
      });
      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products not found');
      }

      const productNameById = new Map(products.map((product) => [product.id, product.name]));
      for (const productId of productIds) {
        const requestedQty = dto.items
          .filter((item) => item.productId === productId)
          .reduce((sum, item) => sum + item.quantity, 0);
        const currentStock = await calculateStock(tx, productId);
        if (requestedQty > currentStock) {
          throw new BadRequestException(
            `Insufficient stock for ${productNameById.get(productId) || productId}. Available: ${currentStock}, requested: ${requestedQty}`,
          );
        }
      }

      const damage = await tx.damage.create({
        data: {
          damageNo,
          total: new Decimal(total),
          note: dto.notes || dto.reason,
          damageDate: dto.date ? new Date(dto.date) : new Date(),
          damageItems: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitCost || 0),
              total: new Decimal(item.quantity * (item.unitCost || 0)),
            })),
          },
        },
        include: { damageItems: { include: { product: true } } },
      });

      for (const item of dto.items) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            type: StockLedgerType.OUT,
            source: StockLedgerSource.DAMAGE,
            referenceId: damage.id,
            quantity: item.quantity,
            note: `Damage ${damageNo}`,
          },
        });
      }

      return damage;
    });
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const where: any = { deletedAt: null };
    if (search) where.damageNo = { contains: search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.damage.findMany({
        where,
        include: { damageItems: { include: { product: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.damage.count({ where }),
    ]);

    return { data, meta: getPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const damage = await this.prisma.damage.findFirst({
      where: { id, deletedAt: null },
      include: { damageItems: { include: { product: true } } },
    });
    if (!damage) throw new NotFoundException('Damage not found');
    return damage;
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const damage = await tx.damage.findFirst({
        where: { id, deletedAt: null },
        include: { damageItems: true },
      });
      if (!damage) throw new NotFoundException('Damage not found');

      for (const item of damage.damageItems) {
        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            type: StockLedgerType.IN,
            source: StockLedgerSource.ADJUSTMENT,
            referenceId: damage.id,
            quantity: item.quantity,
            note: `Damage delete reversal - ${damage.damageNo}`,
          },
        });
      }

      await tx.damage.update({ where: { id }, data: { deletedAt: new Date() } });
      return { message: 'Damage deleted successfully' };
    });
  }
}
