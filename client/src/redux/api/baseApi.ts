import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export type TagType =
  | "Owner"
  | "user"
  | "brand"
  | "branch"
  | "product"
  | "order"
  | "Role"
  | "service_order"
  | "company_Info"
  | "Auth"
  | "Permission"
  | "Category";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Owner",
    "user",
    "brand",
    "branch",
    "product",
    "order",
    "Role",
    "service_order",
    "company_Info",
    "Auth",
    "Permission",
    "Category",
  ] as TagType[],
  endpoints: () => ({}),
});
