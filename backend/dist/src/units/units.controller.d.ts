import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        shortName: string | null;
        conversionRate: import("@prisma/client/runtime/library").Decimal;
        baseUnit: string | null;
    }>>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        shortName: string | null;
        conversionRate: import("@prisma/client/runtime/library").Decimal;
        baseUnit: string | null;
    }>;
    create(createUnitDto: CreateUnitDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        shortName: string | null;
        conversionRate: import("@prisma/client/runtime/library").Decimal;
        baseUnit: string | null;
    }>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        shortName: string | null;
        conversionRate: import("@prisma/client/runtime/library").Decimal;
        baseUnit: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
