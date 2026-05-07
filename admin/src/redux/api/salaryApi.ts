import { baseApi } from "./baseApi";

const URL = "/salary";

export const salaryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSalaryPayments: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["Salary"],
    }),
    getSalaryPaymentById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["Salary"],
    }),
    createSalaryPayment: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Salary", "CashBook", "BankAccount"],
    }),
  }),
});

export const {
  useGetSalaryPaymentsQuery,
  useGetSalaryPaymentByIdQuery,
  useCreateSalaryPaymentMutation,
} = salaryApi;
