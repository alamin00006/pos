// src/redux/api/rolesApi.ts
import { baseApi } from "./baseApi";

export type Role = {
  id: string;
  name: string;
  description?: string | null;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // optional: if backend returns counts
  usersCount?: number;
};

export type RoleCreateDto = {
  name: string;
  description?: string;
};

export type RoleUpdateDto = Partial<RoleCreateDto>;

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /roles
    getRoles: build.query<Role[], { q?: string } | void>({
      query: (arg) => ({
        url: `/roles`,
        method: "GET",
        params: arg ?? undefined,
      }),
      providesTags: ["Role"],
    }),

    // GET /roles/:id
    getRole: build.query<Role, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Role" as const, id }],
    }),

    // POST /roles
    createRole: build.mutation<any, RoleCreateDto>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Role"],
    }),

    // PATCH /roles/:id
    updateRole: build.mutation<Role, { id: string; body: RoleUpdateDto }>({
      query: ({ id, body }) => ({
        url: `/roles/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Role" as const, id: "LIST" },
        { type: "Role" as const, id: arg.id },
        "Role",
      ],
    }),

    // DELETE /roles/:id
    deleteRole: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Role" as const, id: "LIST" },
        { type: "Role" as const, id },
        "Role",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
