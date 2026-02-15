import {
  Customer,
  CustomerFormData,
} from "@/components/Customers/customer.types";
import { baseApi } from "./baseApi";

const CUSTOMER_URL = "/customers";

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomers: build.query<Customer[], void>({
      query: (arg) => ({
        url: `${CUSTOMER_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: ["user"],
    }),
    getCustomerById: build.query<Customer, number>({
      query: (id) => ({
        url: `${CUSTOMER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    createCustomer: build.mutation<Customer, Partial<CustomerFormData>>({
      query: (data) => ({
        url: `${CUSTOMER_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    updateCustomer: build.mutation<
      Customer,
      { id: number; data: Partial<CustomerFormData> }
    >({
      query: ({ id, data }) => ({
        url: `${CUSTOMER_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    deleteCustomer: build.mutation<void, number>({
      query: (id) => ({
        url: `${CUSTOMER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    updateCustomerStatus: build.mutation<
      Customer,
      { id: number; status: "active" | "inactive" | "blocked" }
    >({
      query: ({ id, status }) => ({
        url: `${CUSTOMER_URL}/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["user"],
    }),
    addLoyaltyPoints: build.mutation<
      Customer,
      { id: number; points: number; reason?: string }
    >({
      query: ({ id, points, reason }) => ({
        url: `${CUSTOMER_URL}/${id}/loyalty-points`,
        method: "POST",
        body: { points, reason },
      }),
      invalidatesTags: ["user"],
    }),

    getAllOrdersCustomer: build.query<Customer[], void>({
      query: (arg) => {
        return {
          url: `/customers/search-by-order`,
          method: "GET",
          params: arg,
        };
      },
      providesTags: ["order"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerStatusMutation,
  useAddLoyaltyPointsMutation,
  useGetAllOrdersCustomerQuery,
} = customerApi;
