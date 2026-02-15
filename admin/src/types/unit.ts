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

// types/unit.ts
export type UnitConversion = {
  id: string;
  unitId: string;
  relatedToId: string;
  sign: "*" | "/";
  factor: string; // Decimal usually comes as string
  relatedTo?: {
    id: string;
    name: string;
    shortName?: string | null;
  };
};

export type Unit = {
  id: string;
  name: string;
  shortName?: string | null;
  createdAt?: string;
  updatedAt?: string;
  conversion?: UnitConversion | null;
};

export type CreateUnitDto = {
  name: string;
  shortName?: string;
};

export type UpdateUnitDto = Partial<CreateUnitDto>;
