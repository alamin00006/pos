import { baseApi } from "@/redux/api/baseApi";
import {
  ApiResponse,
  CreateSubcategoryDto,
  PaginatedResponse,
  PaginationQuery,
  Subcategory,
  UpdateSubcategoryDto,
} from "@/types/subcategory";

export const subcategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /subcategories */
    getSubcategories: builder.query<
      ApiResponse<PaginatedResponse<Subcategory>>,
      PaginationQuery
    >({
      query: (params) => ({
        url: "/subcategories",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((s) => ({
                type: "Subcategory" as const,
                id: s.id,
              })),
              { type: "Subcategory" as const, id: "LIST" },
            ]
          : [{ type: "Subcategory" as const, id: "LIST" }],
    }),

    /** GET /subcategories/by-category/:categoryId */
    getSubcategoriesByCategory: builder.query<
      ApiResponse<Subcategory[]>,
      string
    >({
      query: (categoryId) => ({
        url: `/subcategories/by-category/${categoryId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((s) => ({
                type: "Subcategory" as const,
                id: s.id,
              })),
              { type: "Subcategory" as const, id: "BY_CATEGORY" },
            ]
          : [{ type: "Subcategory" as const, id: "BY_CATEGORY" }],
    }),

    /** GET /subcategories/:id */
    getSubcategory: builder.query<ApiResponse<Subcategory>, string>({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Subcategory" as const, id }],
    }),

    /** POST /subcategories */
    createSubcategory: builder.mutation<
      ApiResponse<Subcategory>,
      CreateSubcategoryDto
    >({
      query: (data) => ({
        url: "/subcategories",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "Subcategory" as const, id: "LIST" },
        { type: "Subcategory" as const, id: "BY_CATEGORY" },
      ],
    }),

    /** PUT /subcategories/:id */
    updateSubcategory: builder.mutation<
      ApiResponse<Subcategory>,
      { id: string; data: UpdateSubcategoryDto }
    >({
      query: ({ id, data }) => ({
        url: `/subcategories/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Subcategory" as const, id: arg.id },
        { type: "Subcategory" as const, id: "LIST" },
        { type: "Subcategory" as const, id: "BY_CATEGORY" },
      ],
    }),

    /** DELETE /subcategories/:id */
    deleteSubcategory: builder.mutation<
      ApiResponse<{ message: string }>,
      string
    >({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Subcategory" as const, id },
        { type: "Subcategory" as const, id: "LIST" },
        { type: "Subcategory" as const, id: "BY_CATEGORY" },
      ],
    }),
  }),
});

export const {
  useGetSubcategoriesQuery,
  useGetSubcategoriesByCategoryQuery,
  useGetSubcategoryQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = subcategoriesApi;
