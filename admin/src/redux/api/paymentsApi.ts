import { baseApi } from "./baseApi";

const URL = "/payments";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPayments: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["Payment"],
    }),
    getPaymentById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["Payment"],
    }),
    createPayment: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Payment", "sales", "Purchase", "customers", "supplier", "CashBook", "BankAccount"],
    }),
    deletePayment: build.mutation<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
} = paymentsApi;
