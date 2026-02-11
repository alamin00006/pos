import { Brand } from "@/components/brands/brand.types";
import { baseApi } from "./baseApi";

const Branch_URL = "/branches";

const branchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleBranch: build.query<Brand, void>({
      query: (id) => ({
        url: `${Branch_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["branch"],
    }),

    getAllBranch: build.query<Brand[], void>({
      query: (arg) => ({
        url: `${Branch_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: ["branch"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSingleBranchQuery, useGetAllBranchQuery } = branchApi;
