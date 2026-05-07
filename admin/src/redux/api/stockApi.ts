import { baseApi } from "./baseApi";

const URL = "/stock";

export const stockApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStockReport: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["ProductStock"],
    }),
    getLowStock: build.query<any, any>({
      query: (params) => ({ url: `${URL}/low`, method: "GET", params }),
      providesTags: ["ProductStock"],
    }),
    getProductLedger: build.query<any, { productId: string; params?: any }>({
      query: ({ productId, params }) => ({
        url: `${URL}/ledger/${productId}`,
        method: "GET",
        params,
      }),
      providesTags: ["ProductStock"],
    }),
    adjustStock: build.mutation<any, any>({
      query: (data) => ({ url: `${URL}/adjust`, method: "POST", data }),
      invalidatesTags: ["ProductStock", "Product"],
    }),
    setOpeningStock: build.mutation<any, { productId: string; quantity: number; note?: string }>({
      query: ({ productId, ...data }) => ({
        url: `${URL}/opening/${productId}`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["ProductStock", "Product"],
    }),
  }),
});

export const {
  useGetStockReportQuery,
  useGetLowStockQuery,
  useGetProductLedgerQuery,
  useAdjustStockMutation,
  useSetOpeningStockMutation,
} = stockApi;
