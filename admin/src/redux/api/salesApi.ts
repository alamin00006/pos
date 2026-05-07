import { baseApi } from "./baseApi";

const SALES_URL = "/sales";

export const salesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ===============================
    // GET ALL SALES
    // ===============================
    getSales: build.query<any, any>({
      query: (params) => ({
        url: SALES_URL,
        method: "GET",
        params,
      }),
      providesTags: ["sales"],
    }),

    // ===============================
    // GET TODAY SALES
    // ===============================
    getTodaySales: build.query<any, void>({
      query: () => ({
        url: `${SALES_URL}/today`,
        method: "GET",
      }),
      providesTags: ["sales"],
    }),

    // ===============================
    // SALES REPORT
    // ===============================
    getSalesReport: build.query<any, any>({
      query: (params) => ({
        url: `${SALES_URL}/report`,
        method: "GET",
        params,
      }),
      providesTags: ["sales"],
    }),

    // ===============================
    // GET SINGLE SALE
    // ===============================
    getSaleById: build.query<any, string>({
      query: (id) => ({
        url: `${SALES_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["sales"],
    }),

    // ===============================
    // GET RECEIPT
    // ===============================
    getSaleReceipt: build.query<any, string>({
      query: (id) => ({
        url: `${SALES_URL}/${id}/receipt`,
        method: "GET",
      }),
    }),

    // ===============================
    // CREATE SALE (POS)
    // ===============================
    createSale: build.mutation<any, any>({
      query: (data) => ({
        url: SALES_URL,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["sales"],
    }),

    // ===============================
    // UPDATE SALE
    // ===============================
    updateSale: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${SALES_URL}/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["sales"],
    }),

    // ===============================
    // DELETE SALE
    // ===============================
    deleteSale: build.mutation<any, string>({
      query: (id) => ({
        url: `${SALES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sales"],
    }),

    // ===============================
    // ADD PAYMENT
    // ===============================
    addSalePayment: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${SALES_URL}/${id}/payment`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["sales"],
    }),

    // ===============================
    // DUPLICATE SALE
    // ===============================
    duplicateSale: build.mutation<any, string>({
      query: (id) => ({
        url: `${SALES_URL}/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["sales"],
    }),

    // ===============================
    // REFUND SALE
    // ===============================
    refundSale: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${SALES_URL}/${id}/refund`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["sales"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetTodaySalesQuery,
  useGetSalesReportQuery,
  useGetSaleByIdQuery,
  useGetSaleReceiptQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useAddSalePaymentMutation,
  useDuplicateSaleMutation,
  useRefundSaleMutation,
} = salesApi;
