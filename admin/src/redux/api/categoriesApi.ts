import { baseApi } from "@/redux/api/baseApi";
import type {
  ApiResponse,
  Category,
  CategoryListQuery,
  CreateCategoryDto,
  PaginatedResponse,
  UpdateCategoryDto,
} from "@/types/category";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<any, CategoryListQuery>({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((c) => ({
                type: "Category" as const,
                id: c.id,
              })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),

    getCategory: builder.query<ApiResponse<Category>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Category" as const, id }],
    }),

    createCategory: builder.mutation<ApiResponse<Category>, CreateCategoryDto>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Category" as const, id: "LIST" }],
    }),

    updateCategory: builder.mutation<ApiResponse<Category>, any>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Category" as const, id: arg.id },
        { type: "Category" as const, id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Category" as const, id },
        { type: "Category" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
