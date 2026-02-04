import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class OwnersController {
    private readonly ownersService;
    constructor(ownersService: OwnersService);
    findAll(query: PaginationDto): Promise<import("../common/utils/pagination.util").PaginatedResult<{
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
    }>>;
    findOne(id: string): Promise<{
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
    }>;
    create(createOwnerDto: CreateOwnerDto): Promise<{
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
    }>;
    update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
