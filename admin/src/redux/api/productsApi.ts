import { baseApi } from "@/redux/api/baseApi";
import {
  ApiResponse,
  CreateProductDto,
  PaginatedResponse,
  Product,
  ProductListQuery,
  StockResponse,
  UpdateProductDto,
} from "@/types/product";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /products */
    getProducts: builder.query<any, ProductListQuery>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p) => ({
                type: "Product" as const,
                id: p.id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    /** GET /products/search?q= */
    searchProducts: builder.query<ApiResponse<Product[]>, { q: string }>({
      query: ({ q }) => ({
        url: "/products/search",
        method: "GET",
        params: { q },
      }),
      providesTags: (result) =>
        result?.data
          ? result.data.map((p) => ({ type: "Product" as const, id: p.id }))
          : [],
    }),

    /** GET /products/by-barcode/:barcode */
    getProductByBarcode: builder.query<ApiResponse<Product>, string>({
      query: (barcode) => ({
        url: `/products/by-barcode/${encodeURIComponent(barcode)}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data?.id
          ? [{ type: "Product" as const, id: result.data.id }]
          : [],
    }),

    /** GET /products/:id */
    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Product" as const, id }],
    }),

    /** GET /products/:id/stock */
    getProductStock: builder.query<ApiResponse<StockResponse>, string>({
      query: (id) => ({
        url: `/products/${id}/stock`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "ProductStock" as const, id }],
    }),

    /** POST /products */
    createProduct: builder.mutation<ApiResponse<Product>, CreateProductDto>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Product" as const, id: "LIST" }],
    }),

    /** PUT /products/:id */
    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; data: UpdateProductDto }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Product" as const, id: arg.id },
        { type: "Product" as const, id: "LIST" },
      ],
    }),

    /** PUT /products/:id/sell-price  body: { sellPrice: number } */
    updateProductSellPrice: builder.mutation<
      ApiResponse<Product>,
      { id: string; sellPrice: number }
    >({
      query: ({ id, sellPrice }) => ({
        url: `/products/${id}/sell-price`,
        method: "PUT",
        data: { sellPrice },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Product" as const, id: arg.id },
        { type: "Product" as const, id: "LIST" },
        { type: "ProductStock" as const, id: arg.id },
      ],
    }),

    /** DELETE /products/:id */
    deleteProduct: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Product" as const, id },
        { type: "Product" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductByBarcodeQuery,
  useGetProductQuery,
  useGetProductStockQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductSellPriceMutation,
  useDeleteProductMutation,
} = productsApi;
