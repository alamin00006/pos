import { AuthUser } from "../authSlice";
import { baseApi } from "./baseApi";

export type LoginDto = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // POST /auth/login
    login: build.mutation<
      { success: boolean; data: { accessToken: string; user: AuthUser } },
      LoginDto
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // POST /auth/logout
    logout: build.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // GET /auth/me
    me: build.query<{ success: boolean; data: any }, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // POST /auth/change-password
    changePassword: build.mutation<
      { success: boolean; message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        data: body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useChangePasswordMutation,
} = authApi;
