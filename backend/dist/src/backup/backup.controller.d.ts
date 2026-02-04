import { BackupService } from './backup.service';
export declare class BackupController {
    private readonly service;
    constructor(service: BackupService);
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
