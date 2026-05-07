import { baseApi } from "./baseApi";

const URL = "/bank-accounts";

export const bankAccountsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBankAccounts: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["BankAccount"],
    }),
    getBankAccountById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["BankAccount"],
    }),
    createBankAccount: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["BankAccount"],
    }),
    updateBankAccount: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}`, method: "PATCH", data }),
      invalidatesTags: ["BankAccount"],
    }),
    deleteBankAccount: build.mutation<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["BankAccount"],
    }),
    depositBankAccount: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}/deposit`, method: "POST", data }),
      invalidatesTags: ["BankAccount"],
    }),
    withdrawBankAccount: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}/withdraw`, method: "POST", data }),
      invalidatesTags: ["BankAccount"],
    }),
    transferBankAccount: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}/transfer`, method: "POST", data }),
      invalidatesTags: ["BankAccount"],
    }),
  }),
});

export const {
  useGetBankAccountsQuery,
  useGetBankAccountByIdQuery,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
  useDeleteBankAccountMutation,
  useDepositBankAccountMutation,
  useWithdrawBankAccountMutation,
  useTransferBankAccountMutation,
} = bankAccountsApi;
