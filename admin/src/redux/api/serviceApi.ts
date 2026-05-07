import { baseApi } from "./baseApi";

type Service = any;

const SERVICE_URL = "/services";

const serviceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleService: build.query<Service, number>({
      query: (id) => ({
        url: `${SERVICE_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getAllServices: build.query<Service[], void>({
      query: () => ({
        url: `${SERVICE_URL}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSingleServiceQuery, useGetAllServicesQuery } = serviceApi;
