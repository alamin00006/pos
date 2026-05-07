import { baseApi } from "./baseApi";

const URL = "/purchases";

export const purchasesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPurchases: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["Purchase"],
    }),
    getPurchaseById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["Purchase"],
    }),
    getPurchaseReceipt: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}/receipt`, method: "GET" }),
    }),
    getSupplierPurchases: build.query<any, { supplierId: string; params?: any }>({
      query: ({ supplierId, params }) => ({
        url: `${URL}/supplier/${supplierId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Purchase"],
    }),
    createPurchase: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Purchase", "ProductStock", "supplier"],
    }),
    updatePurchase: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}`, method: "PATCH", data }),
      invalidatesTags: ["Purchase", "supplier"],
    }),
    addPurchasePayment: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}/payments`, method: "POST", data }),
      invalidatesTags: ["Purchase", "Payment", "supplier", "CashBook", "BankAccount"],
    }),
    deletePurchase: build.mutation<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Purchase", "ProductStock", "supplier", "CashBook"],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useGetPurchaseReceiptQuery,
  useGetSupplierPurchasesQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useAddPurchasePaymentMutation,
  useDeletePurchaseMutation,
} = purchasesApi;
