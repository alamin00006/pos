import { baseApi } from "./baseApi";

const URL = "/cash-book";

export const cashBookApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCashBook: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["CashBook"],
    }),
    getCashBookBalance: build.query<any, void>({
      query: () => ({ url: `${URL}/balance`, method: "GET" }),
      providesTags: ["CashBook"],
    }),
    getCashBookSummary: build.query<any, any>({
      query: (params) => ({ url: `${URL}/summary`, method: "GET", params }),
      providesTags: ["CashBook"],
    }),
  }),
});

export const {
  useGetCashBookQuery,
  useGetCashBookBalanceQuery,
  useGetCashBookSummaryQuery,
} = cashBookApi;
