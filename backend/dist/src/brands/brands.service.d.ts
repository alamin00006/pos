import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class BrandsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        productsCount: number;
        _count: undefined;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
    }>>;
    findOne(id: string): Promise<{
        productsCount: number;
        _count: undefined;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
    }>;
    create(createBrandDto: CreateBrandDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
    }>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
