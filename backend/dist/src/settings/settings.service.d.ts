import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    get(key: string): Promise<string | null | undefined>;
    set(key: string, value: string): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        value: string | null;
    }>;
    setMany(settings: Record<string, string>): Promise<any>;
}
