import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerPaymentDto } from './dto/customer-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        due: number;
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
    }>>;
    getDueReport(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        due: number;
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
    }>>;
    findOne(id: string): Promise<{
        due: number;
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
    }>;
    getLedger(id: string, query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.CustomerLedgerType;
        amount: import("@prisma/client/runtime/library").Decimal;
        referenceId: string | null;
        note: string | null;
        balance: import("@prisma/client/runtime/library").Decimal;
        customerId: string;
    }>>;
    create(dto: CreateCustomerDto, userId: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateCustomerDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    makePayment(id: string, dto: CustomerPaymentDto): Promise<{
        message: string;
        newDue: number;
    }>;
}
