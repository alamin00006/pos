import { baseApi } from "./baseApi";

type Size = any;
type SizeFormData = any;

const SIZE_URL = "/sizes";

const sizeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleSize: build.query<Size, void>({
      query: () => ({
        url: `${SIZE_URL}/me`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getAllSizes: build.query<Size[], void>({
      query: (arg) => ({
        url: `${SIZE_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: ["user"],
    }),

    createSize: build.mutation<Size, Partial<SizeFormData>>({
      query: (data) => ({
        url: `${SIZE_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["user"], // ✅ Auto refetch after create
    }),

    updateSize: build.mutation<Size, { id: number; data: Partial<SizeFormData> }>({
      query: ({ id, data }) => ({
        url: `${SIZE_URL}/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["user"], // ✅ Auto refetch after update
    }),

    deleteSize: build.mutation<void, number>({
      query: (id) => ({
        url: `${SIZE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"], // ✅ Auto refetch after delete
    }),

    updateSizeStatus: build.mutation<Size, { id: number; status: "active" | "inactive" }>({
      query: ({ id, status }) => ({
        url: `${SIZE_URL}/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["user"], // ✅ Auto refetch after status change
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetSingleSizeQuery, 
  useGetAllSizesQuery,
  useCreateSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
  useUpdateSizeStatusMutation,
} = sizeApi;
