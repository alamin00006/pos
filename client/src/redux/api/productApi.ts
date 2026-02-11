import { Brand } from "@/components/brands/brand.types";
import { baseApi } from "./baseApi";

const PRODUCT_URL = "/products";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleProduct: build.query<Brand, void>({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["product"],
    }),

    getAllProducts: build.query<Brand[], void>({
      query: (arg) => ({
        url: `${PRODUCT_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: ["product"],
    }),
    getProductsByCategory: build.query<Brand[], void>({
      query: (arg) => ({
        url: `${PRODUCT_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: ["product"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSingleProductQuery,
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
} = productApi;
