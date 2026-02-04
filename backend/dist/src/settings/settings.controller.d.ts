import { SettingsService } from './settings.service';
import { BulkUpsertSettingsDto } from './dto';
export declare class SettingsController {
    private readonly service;
    constructor(service: SettingsService);
    findAll(): Promise<any>;
    get(key: string): Promise<string | null | undefined>;
    setMany(dto: BulkUpsertSettingsDto): Promise<any>;
}
