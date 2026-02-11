// src/redux/api/usersApi.ts
import { baseApi } from "@/redux/api/baseApi";

type Paginated<T> = {
  data: T[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  success?: boolean;
  message?: string;
};

export type UserListItem = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  roles?: string[];
};

export type RoleItem = {
  id: string;
  name: string;
  description?: string | null;
  isSystem?: boolean;
};

export type UserDetails = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: RoleItem[]; // from findOne: roles are full role objects
  permissions: string[]; // permission keys
};

export type GetUsersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type CreateUserDto = {
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  roleIds?: string[]; // optional
};

export type UpdateUserDto = {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  // roleIds ignored by backend update() (you assignRole endpoint separately)
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /users?page=&limit=&search=&sortBy=&sortOrder=
    getUsers: build.query<Paginated<UserListItem>, GetUsersQuery | void>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "user" as const, id: "LIST" },
              ...result.data.map((u) => ({ type: "user" as const, id: u.id })),
            ]
          : [{ type: "user" as const, id: "LIST" }],
    }),

    // GET /users/:id
    getUserById: build.query<{ data: UserDetails } | UserDetails, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "user", id }],
    }),

    // POST /users
    createUser: build.mutation<any, CreateUserDto>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "user", id: "LIST" }],
    }),

    // PUT /users/:id
    updateUser: build.mutation<any, { id: string; body: UpdateUserDto }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "user", id: "LIST" },
        { type: "user", id: arg.id },
      ],
    }),

    // DELETE /users/:id
    deleteUser: build.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "user", id: "LIST" },
        { type: "user", id },
      ],
    }),

    // POST /users/:id/assign-role  body: { roleId }
    assignRoleToUser: build.mutation<any, { userId: string; roleId: string }>({
      query: ({ userId, roleId }) => ({
        url: `/users/${userId}/assign-role`,
        method: "POST",
        data: { roleId },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "user", id: arg.userId },
        { type: "user", id: "LIST" },
      ],
    }),

    // DELETE /users/:id/remove-role/:roleId
    removeRoleFromUser: build.mutation<any, { userId: string; roleId: string }>(
      {
        query: ({ userId, roleId }) => ({
          url: `/users/${userId}/remove-role/${roleId}`,
          method: "DELETE",
        }),
        invalidatesTags: (_res, _err, arg) => [
          { type: "user", id: arg.userId },
          { type: "user", id: "LIST" },
        ],
      },
    ),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignRoleToUserMutation,
  useRemoveRoleFromUserMutation,
} = usersApi;
