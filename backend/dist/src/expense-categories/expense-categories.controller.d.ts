import { ExpenseCategoriesService } from './expense-categories.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto';
export declare class ExpenseCategoriesController {
    private readonly service;
    constructor(service: ExpenseCategoriesService);
    create(dto: CreateExpenseCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(query: PaginationDto): Promise<{
        data: ({
            _count: {
                expenses: number;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: UpdateExpenseCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
