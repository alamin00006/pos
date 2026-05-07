import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import {
  paginate,
  buildPaginationQuery,
  buildOrderByQuery,
  buildSearchQuery,
} from "../common/utils/pagination.util";

/**
 * Coordinates Units business logic, validation, and persistence workflows.
 */
@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves filtered Units records for API consumers.
   */
  async findAll(query: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { skip, take } = buildPaginationQuery(page, limit);
    const orderBy = buildOrderByQuery(sortBy, sortOrder);
    const searchQuery = buildSearchQuery(search, ["name", "shortName"]);

    const where = {
      ...this.prisma.notDeleted(),
      ...searchQuery,
    };

    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          conversion: {
            include: {
              relatedTo: true,
            },
          },
        },
      }),
      this.prisma.unit.count({ where }),
    ]);

    // Optional: screenshot style fields attach (frontend-friendly)
    const formatted = units.map((u) => {
      const c = u.conversion;
      const relatedTo = c?.relatedTo?.shortName || c?.relatedTo?.name || "-";
      const sign = c?.sign || "-";
      const factor = c?.factor ? String(c.factor) : "-";
      const result =
        c && c.relatedTo ? `${u.name} = 1 ${relatedTo} ${sign} ${factor}` : "";

      return {
        ...u,
        relatedTo,
        sign,
        factor,
        result,
      };
    });

    return paginate(formatted, total, page!, limit!);
  }

  /**
   * Retrieves a single Units record by identifier.
   */
  async findOne(id: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id, ...this.prisma.notDeleted() },
      include: {
        conversion: {
          include: {
            relatedTo: { select: { id: true, name: true, shortName: true } },
          },
        },
      },
    });

    if (!unit) throw new NotFoundException("Unit not found");

    return unit;
  }

  /**
   * Creates a new Units record after validating the request payload.
   */
  async create(dto: CreateUnitDto) {
    // unique name check
    const existing = await this.prisma.unit.findFirst({
      where: { name: dto.name, ...this.prisma.notDeleted() },
    });
    if (existing) throw new ConflictException("Unit name already exists");

    const { relatedToId, sign, factor, ...unitData } = dto as any;

    // Create unit first
    const unit = await this.prisma.unit.create({
      data: unitData,
    });

    // If conversion provided, create UnitConversion
    if (relatedToId) {
      if (!factor) {
        throw new BadRequestException(
          "factor is required when relatedToId is provided",
        );
      }

      // base unit must exist
      const base = await this.prisma.unit.findFirst({
        where: { id: relatedToId, ...this.prisma.notDeleted() },
      });
      if (!base) throw new NotFoundException("Related/base unit not found");

      await this.prisma.unitConversion.create({
        data: {
          unitId: unit.id,
          relatedToId,
          sign: sign || "*",
          factor,
        },
      });
    }

    // return full unit with conversion
    return this.findOne(unit.id);
  }

  /**
   * Updates an existing Units record with the provided changes.
   */
  async update(id: string, dto: UpdateUnitDto) {
    const unit = await this.findOne(id);

    // name unique check
    if (dto.name && dto.name !== unit.name) {
      const existing = await this.prisma.unit.findFirst({
        where: { name: dto.name, ...this.prisma.notDeleted() },
      });
      if (existing) throw new ConflictException("Unit name already exists");
    }

    const { relatedToId, sign, factor, ...unitData } = dto as any;

    // update unit basic fields
    await this.prisma.unit.update({
      where: { id },
      data: unitData,
    });

    // conversion logic
    // Case A: relatedToId not provided -> don't touch conversion
    // Case B: relatedToId === null / "" -> remove conversion
    // Case C: relatedToId provided -> upsert conversion
    if (dto.hasOwnProperty("relatedToId")) {
      // remove conversion
      if (!relatedToId) {
        await this.prisma.unitConversion.deleteMany({ where: { unitId: id } });
      } else {
        if (!factor) {
          throw new BadRequestException(
            "factor is required when relatedToId is provided",
          );
        }

        const base = await this.prisma.unit.findFirst({
          where: { id: relatedToId, ...this.prisma.notDeleted() },
        });
        if (!base) throw new NotFoundException("Related/base unit not found");

        await this.prisma.unitConversion.upsert({
          where: { unitId: id },
          update: {
            relatedToId,
            sign: sign || "*",
            factor,
          },
          create: {
            unitId: id,
            relatedToId,
            sign: sign || "*",
            factor,
          },
        });
      }
    }

    return this.findOne(id);
  }

  /**
   * Removes an existing Units record while preserving business consistency.
   */
  async remove(id: string) {
    await this.findOne(id);

    // optional: delete conversion first (cascade à¦†à¦›à§‡ unitId à¦, but safe)
    await this.prisma.unitConversion.deleteMany({ where: { unitId: id } });

    await this.prisma.unit.update({
      where: { id },
      data: this.prisma.softDelete(),
    });

    return { message: "Unit deleted successfully" };
  }
}
