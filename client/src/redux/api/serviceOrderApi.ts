import { baseApi } from "./baseApi";

const ORDER_URL = "/order-services";

const serviceOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleServiceOrder: build.query<any, void>({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["service_order"],
    }),

    getAllServiceOrders: build.query({
      query: (arg) => ({
        url: `${ORDER_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: ["service_order"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSingleServiceOrderQuery, useGetAllServiceOrdersQuery } =
  serviceOrderApi;
