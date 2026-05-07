import { baseApi } from "./baseApi";

const URL = "/expenses";
const CATEGORY_URL = "/expense-categories";

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenses: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["Expense"],
    }),
    getExpenseById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["Expense"],
    }),
    createExpense: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Expense", "CashBook", "BankAccount"],
    }),
    updateExpense: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}`, method: "PATCH", data }),
      invalidatesTags: ["Expense", "CashBook", "BankAccount"],
    }),
    deleteExpense: build.mutation<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Expense", "CashBook", "BankAccount"],
    }),
    getExpenseCategories: build.query<any, any>({
      query: (params) => ({ url: CATEGORY_URL, method: "GET", params }),
      providesTags: ["ExpenseCategory"],
    }),
    createExpenseCategory: build.mutation<any, any>({
      query: (data) => ({ url: CATEGORY_URL, method: "POST", data }),
      invalidatesTags: ["ExpenseCategory"],
    }),
    updateExpenseCategory: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${CATEGORY_URL}/${id}`, method: "PATCH", data }),
      invalidatesTags: ["ExpenseCategory"],
    }),
    deleteExpenseCategory: build.mutation<any, string>({
      query: (id) => ({ url: `${CATEGORY_URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["ExpenseCategory"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpenseCategoriesQuery,
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expensesApi;
