import { baseApi } from "./baseApi";

const URL = "/damages";

export const damagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDamages: build.query<any, any>({
      query: (params) => ({ url: URL, method: "GET", params }),
      providesTags: ["Damage"],
    }),
    getDamageById: build.query<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "GET" }),
      providesTags: ["Damage"],
    }),
    createDamage: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Damage", "ProductStock"],
    }),
    deleteDamage: build.mutation<any, string>({
      query: (id) => ({ url: `${URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Damage", "ProductStock"],
    }),
  }),
});

export const {
  useGetDamagesQuery,
  useGetDamageByIdQuery,
  useCreateDamageMutation,
  useDeleteDamageMutation,
} = damagesApi;
