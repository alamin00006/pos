/* =========================
   Brand Entity (DB Model)
========================= */
export interface Brand {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  productsCount?: number;
}

/* =========================
   Pagination Meta
========================= */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* =========================
   Paginated Brand Response
========================= */
export interface BrandListResponse {
  success: boolean;
  message?: string;
  data: Brand[];
  meta: PaginationMeta;
}

/* =========================
   Single Brand Response
========================= */
export interface BrandResponse {
  success: boolean;
  message?: string;
  data: Brand;
}

/* =========================
   Create / Update DTO
========================= */
export interface CreateBrandDto {
  name: string;
  description?: string;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}
