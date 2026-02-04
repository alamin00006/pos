import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        productsCount: number;
        subcategoriesCount: number;
        _count: undefined;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        code: string | null;
    }>>;
    findOne(id: string): Promise<{
        productsCount: number;
        _count: undefined;
        subcategories: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string | null;
            categoryId: string;
        }[];
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        code: string | null;
    }>;
    create(createCategoryDto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        code: string | null;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        image: string | null;
        code: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
