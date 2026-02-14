import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export type TagType =
  | "Owner"
  | "user"
  | "brand"
  | "branch"
  | "Product"
  | "order"
  | "Role"
  | "service_order"
  | "company_Info"
  | "Auth"
  | "Permission"
  | "Category"
  | "Subcategory"
  | "Unit"
  | "ProductStock";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Owner",
    "user",
    "brand",
    "branch",
    "Product",
    "order",
    "Role",
    "service_order",
    "company_Info",
    "Auth",
    "Permission",
    "Category",
    "Subcategory",
    "Unit",
    "ProductStock",
  ] as TagType[],
  endpoints: () => ({}),
});
