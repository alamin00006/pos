import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierPaymentDto } from './dto/supplier-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
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
        type: import(".prisma/client").$Enums.SupplierLedgerType;
        amount: import("@prisma/client/runtime/library").Decimal;
        referenceId: string | null;
        note: string | null;
        supplierId: string;
        balance: import("@prisma/client/runtime/library").Decimal;
    }>>;
    create(createSupplierDto: CreateSupplierDto, userId?: string): Promise<{
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
    update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<{
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
    makePayment(supplierId: string, paymentDto: SupplierPaymentDto): Promise<{
        message: string;
        newDue: number;
    }>;
    addPurchaseDue(supplierId: string, amount: number, referenceId: string): Promise<void>;
    private calculateDue;
}
