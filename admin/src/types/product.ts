/* ---------------------------------------------
   Common API Wrapper
---------------------------------------------- */

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/* ---------------------------------------------
   Pagination Types
---------------------------------------------- */

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

/* ---------------------------------------------
   Query DTO (GET /products)
---------------------------------------------- */

export type SortOrder = "asc" | "desc";

export type ProductListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
};

/* ---------------------------------------------
   Related Lite Types
---------------------------------------------- */

export type CategoryLite = {
  id: string;
  name: string;
};

export type BrandLite = {
  id: string;
  name: string;
};

export type UnitLite = {
  id: string;
  name: string;
  shortName?: string;
};

/* ---------------------------------------------
   Product Type (Response)
---------------------------------------------- */

export type Product = {
  id: string;

  name: string;
  description?: string | null;

  productCode?: string;
  barcode?: string | null;

  categoryId?: string | null;
  subcategoryId?: string | null;
  brandId?: string | null;
  unitId?: string | null;

  sellPrice?: number | null;
  purchasePrice?: number | null;

  stock?: number; // backend calculateStock থেকে add হচ্ছে

  category?: CategoryLite | null;
  subcategory?: CategoryLite | null;
  brand?: BrandLite | null;
  unit?: UnitLite | null;

  createdAt: string;
  updatedAt: string;
};

/* ---------------------------------------------
   Create DTO
---------------------------------------------- */

export type CreateProductDto = {
  name: string;
  description?: string;

  productCode: string;
  barcode?: string;

  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  unitId?: string;

  sellPrice?: number;
  purchasePrice?: number;
};

/* ---------------------------------------------
   Update DTO
---------------------------------------------- */

export type UpdateProductDto = Partial<CreateProductDto>;

/* ---------------------------------------------
   Stock Response
---------------------------------------------- */

export type StockResponse = {
  productId: string;
  stock: number;
};
