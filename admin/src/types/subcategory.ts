export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type SortOrder = "asc" | "desc";

export type PaginationQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
};

export type CategoryLite = {
  id: string;
  name: string;
};

export type Subcategory = {
  id: string;
  name: string;
  code?: string | null;
  categoryId: string;

  category?: CategoryLite | null;

  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type CreateSubcategoryDto = {
  name: string;
  code?: string;
  categoryId: string;
};

export type UpdateSubcategoryDto = Partial<CreateSubcategoryDto>;
