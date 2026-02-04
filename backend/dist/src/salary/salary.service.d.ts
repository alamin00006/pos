import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class SalaryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        employee: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string | null;
            image: string | null;
            address: string | null;
            nid: string | null;
            designation: string | null;
            department: string | null;
            joinDate: Date;
            basicSalary: Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        note: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentDate: Date;
        basicSalary: Decimal;
        employeeId: string;
        overtime: Decimal;
        bonus: Decimal;
        deduction: Decimal;
        netSalary: Decimal;
        month: number;
        year: number;
    }>;
    findAll(query: PaginationDto & {
        employeeId?: string;
        month?: number;
        year?: number;
    }): Promise<{
        data: ({
            employee: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                email: string | null;
                phone: string | null;
                image: string | null;
                address: string | null;
                nid: string | null;
                designation: string | null;
                department: string | null;
                joinDate: Date;
                basicSalary: Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            note: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentDate: Date;
            basicSalary: Decimal;
            employeeId: string;
            overtime: Decimal;
            bonus: Decimal;
            deduction: Decimal;
            netSalary: Decimal;
            month: number;
            year: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        employee: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string | null;
            image: string | null;
            address: string | null;
            nid: string | null;
            designation: string | null;
            department: string | null;
            joinDate: Date;
            basicSalary: Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        note: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentDate: Date;
        basicSalary: Decimal;
        employeeId: string;
        overtime: Decimal;
        bonus: Decimal;
        deduction: Decimal;
        netSalary: Decimal;
        month: number;
        year: number;
    }>;
}
