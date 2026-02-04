import { PermissionsService } from './permissions.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
        id: string;
        key: string;
        name: string;
        description: string | null;
        module: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findAllGrouped(): Promise<Record<string, {
        id: string;
        key: string;
        name: string;
        description: string | null;
        module: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>>;
}
