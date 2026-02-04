import { SalaryService } from './salary.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateSalaryDto } from './dto';
export declare class SalaryController {
    private readonly service;
    constructor(service: SalaryService);
    create(dto: CreateSalaryDto): Promise<{
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
            basicSalary: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        note: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentDate: Date;
        basicSalary: import("@prisma/client/runtime/library").Decimal;
        employeeId: string;
        overtime: import("@prisma/client/runtime/library").Decimal;
        bonus: import("@prisma/client/runtime/library").Decimal;
        deduction: import("@prisma/client/runtime/library").Decimal;
        netSalary: import("@prisma/client/runtime/library").Decimal;
        month: number;
        year: number;
    }>;
    findAll(query: PaginationDto): Promise<{
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
                basicSalary: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            note: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentDate: Date;
            basicSalary: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            overtime: import("@prisma/client/runtime/library").Decimal;
            bonus: import("@prisma/client/runtime/library").Decimal;
            deduction: import("@prisma/client/runtime/library").Decimal;
            netSalary: import("@prisma/client/runtime/library").Decimal;
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
            basicSalary: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        note: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentDate: Date;
        basicSalary: import("@prisma/client/runtime/library").Decimal;
        employeeId: string;
        overtime: import("@prisma/client/runtime/library").Decimal;
        bonus: import("@prisma/client/runtime/library").Decimal;
        deduction: import("@prisma/client/runtime/library").Decimal;
        netSalary: import("@prisma/client/runtime/library").Decimal;
        month: number;
        year: number;
    }>;
}
