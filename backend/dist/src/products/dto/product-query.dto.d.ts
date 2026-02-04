import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ProductQueryDto extends PaginationDto {
    categoryId?: string;
    subcategoryId?: string;
    brandId?: string;
}
