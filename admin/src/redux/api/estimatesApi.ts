import { baseApi } from "./baseApi";

const URL = "/estimates";

export const estimatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEstimates: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["Estimate"],
    }),
    getEstimateById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["Estimate"],
    }),
    createEstimate: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Estimate"],
    }),
    updateEstimate: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}`, method: "PATCH", data }),
      invalidatesTags: ["Estimate"],
    }),
    deleteEstimate: build.mutation<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Estimate"],
    }),
  }),
});

export const {
  useGetEstimatesQuery,
  useGetEstimateByIdQuery,
  useCreateEstimateMutation,
  useUpdateEstimateMutation,
  useDeleteEstimateMutation,
} = estimatesApi;
