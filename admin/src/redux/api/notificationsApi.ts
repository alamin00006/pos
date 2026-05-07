import { baseApi } from "./baseApi";

const URL = "/notifications";

export type AppNotification = {
  id: string;
  type: "info" | "success" | "warning" | "danger";
  title: string;
  message: string;
  createdAt: string;
  href?: string;
};

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<
      { unreadCount: number; notifications: AppNotification[] },
      void
    >({
      query: () => ({ url: URL, method: "GET" }),
      providesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;
