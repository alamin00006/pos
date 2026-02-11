
import { Service } from "@/components/services/service.types";
import { baseApi } from "./baseApi";

const PRODUCT_TYPE_URL = "/product-types";

const productTypeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleProductType: build.query<Service, number>({
      query: (id) => ({
        url: `${PRODUCT_TYPE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getAllProductTypes: build.query<Service[], void>({
      query: () => ({
        url: `${PRODUCT_TYPE_URL}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSingleProductTypeQuery, useGetAllProductTypesQuery } = productTypeApi;