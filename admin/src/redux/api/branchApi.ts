import { baseApi } from "./baseApi";

const Branch_URL = "/branches";

const branchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleBranch: build.query<any, string>({
      query: (id) => ({
        url: `${Branch_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["branch"],
    }),

    getAllBranch: build.query<any, any>({
      query: (arg) => ({
        url: `${Branch_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: ["branch"],
    }),
    createBranch: build.mutation<any, any>({
      query: (data) => ({
        url: Branch_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: ["branch"],
    }),
    updateBranch: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${Branch_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["branch"],
    }),
    deleteBranch: build.mutation<any, string>({
      query: (id) => ({
        url: `${Branch_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branch"],
    }),
    assignUserToBranch: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${Branch_URL}/${id}/users`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["branch", "user"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSingleBranchQuery,
  useGetAllBranchQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useAssignUserToBranchMutation,
} = branchApi;
