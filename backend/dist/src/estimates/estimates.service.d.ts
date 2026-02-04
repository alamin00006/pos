import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class EstimatesService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateEstimateNo;
    create(dto: any): Promise<{
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
            openingBalance: Decimal;
            createdById: string | null;
        } | null;
        estimateItems: {
            id: string;
            total: Decimal;
            quantity: number;
            unitPrice: Decimal;
            productName: string;
            estimateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
        note: string | null;
        customerId: string | null;
        discount: Decimal;
        tax: Decimal;
        subtotal: Decimal;
        estimateNo: string;
        validUntil: Date | null;
        estimateDate: Date;
    }>;
    findAll(query: PaginationDto & {
        customerId?: string;
    }): Promise<{
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
                openingBalance: Decimal;
                createdById: string | null;
            } | null;
            estimateItems: {
                id: string;
                total: Decimal;
                quantity: number;
                unitPrice: Decimal;
                productName: string;
                estimateId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            total: Decimal;
            note: string | null;
            customerId: string | null;
            discount: Decimal;
            tax: Decimal;
            subtotal: Decimal;
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
            openingBalance: Decimal;
            createdById: string | null;
        } | null;
        estimateItems: {
            id: string;
            total: Decimal;
            quantity: number;
            unitPrice: Decimal;
            productName: string;
            estimateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
        note: string | null;
        customerId: string | null;
        discount: Decimal;
        tax: Decimal;
        subtotal: Decimal;
        estimateNo: string;
        validUntil: Date | null;
        estimateDate: Date;
    }>;
    update(id: string, dto: any): Promise<{
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
            openingBalance: Decimal;
            createdById: string | null;
        } | null;
        estimateItems: {
            id: string;
            total: Decimal;
            quantity: number;
            unitPrice: Decimal;
            productName: string;
            estimateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
        note: string | null;
        customerId: string | null;
        discount: Decimal;
        tax: Decimal;
        subtotal: Decimal;
        estimateNo: string;
        validUntil: Date | null;
        estimateDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        total: Decimal;
        note: string | null;
        customerId: string | null;
        discount: Decimal;
        tax: Decimal;
        subtotal: Decimal;
        estimateNo: string;
        validUntil: Date | null;
        estimateDate: Date;
    }>;
}
