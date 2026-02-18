// src/redux/api/rbacApi.ts
import { baseApi } from "./baseApi";

export type PermissionRow = {
  id: string; // DB uuid
  key: string; // like "add_owner"
  name: string; // "Add Owner"
  module?: string; // "Owner"
};

export type RoleDetails = {
  id: string;
  name: string;
  description?: string | null;
  permissions: PermissionRow[]; // your RolesService.findOne returns this
};

export type GroupedPermissions = Record<string, PermissionRow[]>;

export type UpdateRolePermissionsPayload = {
  roleId: string;
  permissionIds: string[]; // DB permission ids
};

export const rbacApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /permissions/grouped  (if you have it)
    // If your backend path is different, change url here.
    getPermissionsGrouped: build.query<GroupedPermissions, void>({
      query: () => ({
        url: "/permissions/grouped",
        method: "GET",
      }),
      providesTags: ["Permission"],
    }),

    // GET /roles/:id  (returns role with permissions[])
    getRole: build.query<RoleDetails, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Role" as const, id }],
    }),

    // PUT /roles/:id/permissions (replace all)
    setRolePermissions: build.mutation<any, UpdateRolePermissionsPayload>({
      query: ({ roleId, permissionIds }) => ({
        url: `/roles/${roleId}/permissions`,
        method: "PUT",
        data: { permissionIds }, //  axiosBaseQuery expects data
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Role" as const, id: arg.roleId },
        "Role",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPermissionsGroupedQuery,
  useGetRoleQuery,
  useSetRolePermissionsMutation,
} = rbacApi;
