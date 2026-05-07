import {
  BrandListResponse,
  BrandResponse,
  CreateBrandDto,
  UpdateBrandDto,
} from "@/types/brand";
import { baseApi } from "./baseApi";

export const brandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =======================
       GET ALL BRANDS
    ======================== */
    getBrands: builder.query<
      BrandListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/brands",
        method: "GET",
        params,
      }),
      providesTags: ["brand"],
    }),

    /* =======================
       GET BRAND BY ID
    ======================== */
    getBrandById: builder.query<BrandResponse, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "GET",
      }),
      providesTags: ["brand"],
    }),

    /* =======================
       CREATE BRAND
    ======================== */
    createBrand: builder.mutation<BrandResponse, CreateBrandDto>({
      query: (data) => ({
        url: "/brands",
        method: "POST",
        data,
      }),
      invalidatesTags: ["brand"],
    }),

    /* =======================
       UPDATE BRAND
    ======================== */
    updateBrand: builder.mutation<
      BrandResponse,
      { id: string; data: UpdateBrandDto }
    >({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["brand"],
    }),

    /* =======================
       DELETE BRAND
    ======================== */
    deleteBrand: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brand"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
