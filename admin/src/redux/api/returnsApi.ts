import { baseApi } from "./baseApi";

const URL = "/returns";

export const returnsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReturns: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["Return"],
    }),
    getReturnById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["Return"],
    }),
    createReturn: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Return", "sales", "ProductStock", "customers"],
    }),
    deleteReturn: build.mutation<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Return", "sales", "ProductStock", "customers"],
    }),
  }),
});

export const {
  useGetReturnsQuery,
  useGetReturnByIdQuery,
  useCreateReturnMutation,
  useDeleteReturnMutation,
} = returnsApi;
