import { EstimatesService } from './estimates.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateEstimateDto, UpdateEstimateDto } from './dto';
export declare class EstimatesController {
    private readonly service;
    constructor(service: EstimatesService);
    create(dto: CreateEstimateDto): Promise<{
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            company: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            createdById: string | null;
        } | null;
        estimateItems: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            estimateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        customerId: string | null;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        estimateNo: string;
        validUntil: Date | null;
        estimateDate: Date;
    }>;
    findAll(query: PaginationDto): Promise<{
        data: ({
            customer: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                email: string | null;
                phone: string | null;
                address: string | null;
                company: string | null;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                createdById: string | null;
            } | null;
            estimateItems: {
                id: string;
                total: import("@prisma/client/runtime/library").Decimal;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                productName: string;
                estimateId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            customerId: string | null;
            discount: import("@prisma/client/runtime/library").Decimal;
            tax: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            estimateNo: string;
            validUntil: Date | null;
            estimateDate: Date;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            company: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            createdById: string | null;
        } | null;
        estimateItems: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            estimateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        customerId: string | null;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        estimateNo: string;
        validUntil: Date | null;
        estimateDate: Date;
    }>;
    update(id: string, dto: UpdateEstimateDto): Promise<{
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            company: string | null;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            createdById: string | null;
        } | null;
        estimateItems: {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            estimateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        customerId: string | null;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        estimateNo: string;
        validUntil: Date | null;
        estimateDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: import("@prisma/client/runtime/library").Decimal;
        note: string | null;
        customerId: string | null;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        estimateNo: string;
        validUntil: Date | null;
        estimateDate: Date;
    }>;
}
