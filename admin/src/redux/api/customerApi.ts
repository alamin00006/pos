import { baseApi } from "./baseApi";

const CUSTOMERS_URL = "/customers";

export const customersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ===============================
    // GET ALL CUSTOMERS
    // ===============================
    getCustomers: build.query<any, any>({
      query: (params) => ({
        url: CUSTOMERS_URL,
        method: "GET",
        params,
      }),
      providesTags: ["customers"],
    }),

    // ===============================
    // GET DUE REPORT
    // ===============================
    getCustomersDueReport: build.query<any, any>({
      query: (params) => ({
        url: `${CUSTOMERS_URL}/due-report`,
        method: "GET",
        params,
      }),
      providesTags: ["customers"],
    }),

    // ===============================
    // GET SINGLE CUSTOMER
    // ===============================
    getCustomerById: build.query<any, string>({
      query: (id) => ({
        url: `${CUSTOMERS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "customers", id }],
    }),

    // ===============================
    // GET CUSTOMER LEDGER
    // ===============================
    getCustomerLedger: build.query<any, { id: string; params?: any }>({
      query: ({ id, params }) => ({
        url: `${CUSTOMERS_URL}/${id}/ledger`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: "customers", id }],
    }),

    // ===============================
    // CREATE CUSTOMER
    // ===============================
    createCustomer: build.mutation<any, any>({
      query: (data) => ({
        url: CUSTOMERS_URL,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["customers"],
    }),

    // ===============================
    // UPDATE CUSTOMER
    // ===============================
    updateCustomer: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${CUSTOMERS_URL}/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "customers", id }],
    }),

    // ===============================
    // DELETE CUSTOMER
    // ===============================
    deleteCustomer: build.mutation<any, string>({
      query: (id) => ({
        url: `${CUSTOMERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customers"],
    }),

    // ===============================
    // MAKE PAYMENT (RECEIVE PAYMENT)
    // ===============================
    makeCustomerPayment: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${CUSTOMERS_URL}/${id}/payment`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "customers", id }],
    }),
  }),
});

export const {
  // Queries
  useGetCustomersQuery,
  useGetCustomersDueReportQuery,
  useGetCustomerByIdQuery,
  useGetCustomerLedgerQuery,

  // Mutations
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useMakeCustomerPaymentMutation,
} = customersApi;
