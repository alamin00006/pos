export declare class UpsertSettingDto {
    key: string;
    value: string;
    group?: string;
    description?: string;
}
export declare class BulkUpsertSettingsDto {
    settings: Record<string, string>;
}
