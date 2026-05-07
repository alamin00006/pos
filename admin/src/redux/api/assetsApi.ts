import { baseApi } from "./baseApi";

const URL = "/assets";

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssets: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["Asset"],
    }),
    getAssetById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["Asset"],
    }),
    createAsset: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Asset"],
    }),
    updateAsset: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `${URL}/${id}`, method: "PATCH", data }),
      invalidatesTags: ["Asset"],
    }),
    deleteAsset: build.mutation<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Asset"],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetByIdQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} = assetsApi;
