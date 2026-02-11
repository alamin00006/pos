// src/redux/api/ownersApi.ts
import { baseApi } from "./baseApi";

export type Owner = {
  id: string;
  name: string;
  mobile: string;
  address?: string | null;
  invested?: number;
  withdrawn?: number;
  balance?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type OwnerCreateDto = {
  name: string;
  phone: string;
  address?: string;
};

export type OwnerUpdateDto = Partial<OwnerCreateDto>;

export const ownersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /owners
    getOwners: build.query<Owner[], { q?: string } | void>({
      query: (arg) => ({
        url: `/owners`,
        method: "GET",
        params: arg ?? undefined,
      }),

      providesTags: ["Owner"],
      //   providesTags: (result) =>
      //     result
      //       ? [
      //           { type: "Owner" as const, id: "LIST" },
      //           ...result.map((o) => ({ type: "Owner" as const, id: o.id })),
      //         ]
      //       : [{ type: "Owner" as const, id: "LIST" }],
    }),

    //  GET /owners/:id
    getOwner: build.query<Owner, string>({
      query: (id) => ({
        url: `/owners/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Owner" as const, id }],
    }),

    //  POST /owners
    createOwner: build.mutation<any, OwnerCreateDto>({
      query: (body) => {
        // console.log("CREATE OWNER BODY:", body);
        return {
          url: "/owners",
          method: "POST",
          data: body,
        };
      },
    }),

    //  PATCH /owners/:id
    updateOwner: build.mutation<Owner, { id: string; body: OwnerUpdateDto }>({
      query: ({ id, body }) => ({
        url: `/owners/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Owner" as const, id: "LIST" },
        { type: "Owner" as const, id: arg.id },
      ],
    }),

    //  DELETE /owners/:id
    deleteOwner: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/owners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Owner" as const, id: "LIST" },
        { type: "Owner" as const, id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOwnersQuery,
  useGetOwnerQuery,
  useCreateOwnerMutation,
  useUpdateOwnerMutation,
  useDeleteOwnerMutation,
} = ownersApi;
