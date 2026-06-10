import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { authKey } from "@/constants/authKey";
import {
  getFromLocalStorage,
} from "@/lib/utils/local-storage";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { expireAuthSession } from "@/lib/auth/session";
import { refreshAccessToken } from "@/lib/auth/refresh";

type RetriableAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const instance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

/* =====================
   Request Interceptor
===================== */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getFromLocalStorage(authKey);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const branchId = getFromLocalStorage("selectedBranchId");
    if (branchId) {
      config.headers["x-branch-id"] = branchId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =====================
   Response Interceptor
===================== */
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error?.config as RetriableAxiosRequestConfig;
    const isUnauthorized = error?.response?.status === 401;
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout");

    if (isUnauthorized && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return instance(originalRequest);
      } catch {
        expireAuthSession();
      }
    } else if (isUnauthorized && !isAuthRequest) {
      expireAuthSession();
    }

    return Promise.reject(error);
  },
);

export { instance };
