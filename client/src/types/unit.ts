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

export type Unit = {
  id: string;
  name: string;
  shortName?: string | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type CreateUnitDto = {
  name: string;
  shortName?: string;
};

export type UpdateUnitDto = Partial<CreateUnitDto>;
