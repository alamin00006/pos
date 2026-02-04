import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class SubcategoriesController {
    private readonly subcategoriesService;
    constructor(subcategoriesService: SubcategoriesService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        productsCount: number;
        _count: undefined;
        category: {
            id: string;
            name: string;
        };
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string | null;
        categoryId: string;
    }>>;
    findByCategory(categoryId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string | null;
        categoryId: string;
    }[]>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string | null;
        categoryId: string;
    }>;
    create(createSubcategoryDto: CreateSubcategoryDto): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string | null;
        categoryId: string;
    }>;
    update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string | null;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
