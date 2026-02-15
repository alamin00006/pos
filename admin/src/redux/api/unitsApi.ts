import { baseApi } from "@/redux/api/baseApi";
import {
  ApiResponse,
  CreateUnitDto,
  PaginatedResponse,
  PaginationQuery,
  Unit,
  UpdateUnitDto,
} from "@/types/unit";

export const unitsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /units */
    getUnits: builder.query<
      ApiResponse<PaginatedResponse<Unit>>,
      PaginationQuery
    >({
      query: (params) => ({
        url: "/units",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((u) => ({
                type: "Unit" as const,
                id: u.id,
              })),
              { type: "Unit" as const, id: "LIST" },
            ]
          : [{ type: "Unit" as const, id: "LIST" }],
    }),

    /** GET /units/:id */
    getUnit: builder.query<ApiResponse<Unit>, string>({
      query: (id) => ({
        url: `/units/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Unit" as const, id }],
    }),

    /** POST /units */
    createUnit: builder.mutation<ApiResponse<Unit>, CreateUnitDto>({
      query: (data) => ({
        url: "/units",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Unit" as const, id: "LIST" }],
    }),

    /** PUT /units/:id */
    updateUnit: builder.mutation<
      ApiResponse<Unit>,
      { id: string; data: UpdateUnitDto }
    >({
      query: ({ id, data }) => ({
        url: `/units/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Unit" as const, id: arg.id },
        { type: "Unit" as const, id: "LIST" },
      ],
    }),

    /** DELETE /units/:id */
    deleteUnit: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: `/units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Unit" as const, id },
        { type: "Unit" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useGetUnitQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitsApi;
