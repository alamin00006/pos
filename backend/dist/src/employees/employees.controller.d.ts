import { EmployeesService } from './employees.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
export declare class EmployeesController {
    private readonly service;
    constructor(service: EmployeesService);
    create(dto: CreateEmployeeDto): Promise<{
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
    }>;
    findAll(query: PaginationDto): Promise<{
        data: ({
            _count: {
                salaryPayments: number;
            };
        } & {
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        salaryPayments: {
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
        }[];
    } & {
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
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
