import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { StockLedgerType, StockLedgerSource } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class DamagesService {
  constructor(private prisma: PrismaService) {}

  private async generateDamageNo(): Promise<string> {
    const today = new Date();
    const prefix = `DMG${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    const lastDamage = await this.prisma.damage.findFirst({
      where: { damageNo: { startsWith: prefix } },
      orderBy: { damageNo: 'desc' },
    });
    let sequence = 1;
    if (lastDamage) sequence = parseInt(lastDamage.damageNo.slice(-4)) + 1;
    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }

  async create(dto: any) {
    const damageNo = await this.generateDamageNo();
    const total = dto.items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);

    return this.prisma.$transaction(async (tx) => {
      const damage = await tx.damage.create({
        data: {
          damageNo,
          total: new Decimal(total),
          note: dto.note,
          damageDate: dto.damageDate ? new Date(dto.damageDate) : new Date(),
          damageItems: {
            create: dto.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitPrice),
              total: new Decimal(item.quantity * item.unitPrice),
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
    const damage = await this.prisma.damage.findUnique({
      where: { id, deletedAt: null },
      include: { damageItems: { include: { product: true } } },
    });
    if (!damage) throw new NotFoundException('Damage not found');
    return damage;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.damage.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
