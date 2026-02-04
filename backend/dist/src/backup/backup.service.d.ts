import { PrismaService } from '../prisma/prisma.service';
export declare class BackupService {
    private prisma;
    constructor(prisma: PrismaService);
    getBackupInfo(): Promise<{
        message: string;
        instructions: string[];
        statistics: {
            users: number;
            customers: number;
            suppliers: number;
            products: number;
            sales: number;
            purchases: number;
            expenses: number;
        };
        timestamp: string;
    }>;
}
