export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function getPaginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export function buildPaginationQuery(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

export function buildOrderByQuery(
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc',
  defaultSort: string = 'createdAt',
) {
  const field = sortBy || defaultSort;
  return { [field]: sortOrder };
}

export function buildSearchQuery(search?: string, fields: string[] = ['name']) {
  if (!search) return {};
  
  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search,
        mode: 'insensitive' as const,
      },
    })),
  };
}
