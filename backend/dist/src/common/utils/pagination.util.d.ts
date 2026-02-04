export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare function paginate<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T>;
export declare function getPaginationMeta(total: number, page: number, limit: number): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
export declare function buildPaginationQuery(page?: number, limit?: number): {
    skip: number;
    take: number;
};
export declare function buildOrderByQuery(sortBy?: string, sortOrder?: 'asc' | 'desc', defaultSort?: string): {
    [x: string]: "asc" | "desc";
};
export declare function buildSearchQuery(search?: string, fields?: string[]): {
    OR?: undefined;
} | {
    OR: {
        [x: string]: {
            contains: string;
            mode: "insensitive";
        };
    }[];
};
