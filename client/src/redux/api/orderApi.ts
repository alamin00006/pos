import { baseApi } from "./baseApi";

const ORDER_URL = "/orders";

const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  Get single order
    getSingleOrder: build.query<any, string>({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "order", id }],
    }),

    //  Get all orders
    getAllOrders: build.query<any, any>({
      query: (arg) => ({
        url: ORDER_URL,
        method: "GET",
        params: arg,
      }),
      providesTags: ["order"],
    }),

    //  Get orders by category / filter
    getOrdersByCategory: build.query<any[], any>({
      query: (arg) => ({
        url: ORDER_URL,
        method: "GET",
        params: arg,
      }),
      providesTags: ["order"],
    }),

    //  ORDER Payment
    orderPayment: build.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `${ORDER_URL}/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "order", id },
        "order",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSingleOrderQuery,
  useGetAllOrdersQuery,
  useGetOrdersByCategoryQuery,
  useOrderPaymentMutation,
} = orderApi;
