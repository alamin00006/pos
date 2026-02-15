// colorApi.ts

import { Color } from "framer-motion";
import { baseApi } from "./baseApi";
import { ColorFormData } from "@/components/color/color.types";

const COLOR_URL = "/colors";

const colorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllColors: build.query<Color[], void>({
      query: () => ({
        url: `${COLOR_URL}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getSingleColor: build.query<Color, number>({
      query: (id) => ({
        url: `${COLOR_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    createColor: build.mutation<Color, Partial<ColorFormData>>({
      query: (data) => ({
        url: `${COLOR_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    updateColor: build.mutation<Color, { id: number; data: Partial<ColorFormData> }>({
      query: ({ id, data }) => ({
        url: `${COLOR_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    deleteColor: build.mutation<void, number>({
      query: (id) => ({
        url: `${COLOR_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    updateColorStatus: build.mutation<Color, { id: number; status: "active" | "inactive" }>({
      query: ({ id, status }) => ({
        url: `${COLOR_URL}/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["user"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllColorsQuery,
  useGetSingleColorQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useUpdateColorStatusMutation,
} = colorApi;