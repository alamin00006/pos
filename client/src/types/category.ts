export interface Category {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;

  // counts from service (formatted)
  productsCount?: number;
  subcategoriesCount?: number;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** Query params your backend supports */
export interface CategoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** DTOs (match Nest DTO) */
export interface CreateCategoryDto {
  id?: string;
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  id?: string;
  name?: string;
  description?: string;
}
