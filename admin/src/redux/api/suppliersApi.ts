import { baseApi } from "./baseApi";
import type {
  SupplierListResponse,
  SupplierResponse,
  SupplierLedgerListResponse,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierPaymentDto,
} from "@/types/supplier";

export const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =======================
       GET ALL SUPPLIERS
    ======================== */
    getSuppliers: builder.query<
      SupplierListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/suppliers",
        method: "GET",
        params,
      }),
      providesTags: ["supplier"],
    }),

    /* =======================
       GET SUPPLIER DUE REPORT
    ======================== */
    getSupplierDueReport: builder.query<
      SupplierListResponse,
      {
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/suppliers/due-report",
        method: "GET",
        params,
      }),
      providesTags: ["supplier"],
    }),

    /* =======================
       GET SUPPLIER BY ID
    ======================== */
    getSupplierById: builder.query<SupplierResponse, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "GET",
      }),
      providesTags: ["supplier"],
    }),

    /* =======================
       GET SUPPLIER LEDGER
    ======================== */
    getSupplierLedger: builder.query<
      SupplierLedgerListResponse,
      {
        id: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ id, ...params }) => ({
        url: `/suppliers/${id}/ledger`,
        method: "GET",
        params,
      }),
      providesTags: ["supplier"],
    }),

    /* =======================
       CREATE SUPPLIER
    ======================== */
    createSupplier: builder.mutation<SupplierResponse, CreateSupplierDto>({
      query: (data) => ({
        url: "/suppliers",
        method: "POST",
        data,
      }),
      invalidatesTags: ["supplier"],
    }),

    /* =======================
       UPDATE SUPPLIER
    ======================== */
    updateSupplier: builder.mutation<
      SupplierResponse,
      { id: string; data: UpdateSupplierDto }
    >({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["supplier"],
    }),

    /* =======================
       DELETE SUPPLIER (SOFT)
    ======================== */
    deleteSupplier: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["supplier"],
    }),

    /* =======================
       MAKE PAYMENT TO SUPPLIER
    ======================== */
    makeSupplierPayment: builder.mutation<
      { message: string; newDue: number },
      { id: string; data: SupplierPaymentDto }
    >({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}/payment`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["supplier"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierDueReportQuery,
  useGetSupplierByIdQuery,
  useGetSupplierLedgerQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useMakeSupplierPaymentMutation,
} = suppliersApi;
