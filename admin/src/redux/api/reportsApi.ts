import { baseApi } from "./baseApi";

const URL = "/reports";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodayReport: build.query<any, void>({
      query: () => ({ url: `${URL}/today`, method: "GET" }),
      providesTags: ["Report"],
    }),
    getDailyReport: build.query<any, any>({
      query: (params) => ({ url: `${URL}/daily`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getCurrentMonthReport: build.query<any, void>({
      query: () => ({ url: `${URL}/current-month`, method: "GET" }),
      providesTags: ["Report"],
    }),
    getProfitLossReport: build.query<any, any>({
      query: (params) => ({ url: `${URL}/profit-loss`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getTopProductsReport: build.query<any, any>({
      query: (params) => ({ url: `${URL}/top-products`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getTopCustomersReport: build.query<any, any>({
      query: (params) => ({ url: `${URL}/top-customers`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getCategoryWiseReport: build.query<any, any>({
      query: (params) => ({ url: `${URL}/category-wise`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getReportSales: build.query<any, any>({
      query: (params) => ({ url: `${URL}/sales`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getPurchaseReport: build.query<any, any>({
      query: (params) => ({ url: `${URL}/purchases`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getCustomerDueReport: build.query<any, any>({
      query: (params) => ({ url: `${URL}/customer-due`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getSupplierDueReport: build.query<any, any>({
      query: (params) => ({ url: `${URL}/supplier-due`, method: "GET", params }),
      providesTags: ["Report"],
    }),
    getLowStockReport: build.query<any, void>({
      query: () => ({ url: `${URL}/low-stock`, method: "GET" }),
      providesTags: ["Report", "ProductStock"],
    }),
    getSummaryReport: build.query<any, void>({
      query: () => ({ url: `${URL}/summary`, method: "GET" }),
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useGetTodayReportQuery,
  useGetDailyReportQuery,
  useGetCurrentMonthReportQuery,
  useGetProfitLossReportQuery,
  useGetTopProductsReportQuery,
  useGetTopCustomersReportQuery,
  useGetCategoryWiseReportQuery,
  useGetReportSalesQuery,
  useGetPurchaseReportQuery,
  useGetCustomerDueReportQuery,
  useGetSupplierDueReportQuery,
  useGetLowStockReportQuery,
  useGetSummaryReportQuery,
} = reportsApi;
