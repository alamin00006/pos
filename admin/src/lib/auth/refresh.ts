import axios from "axios";

import { getBaseUrl } from "@/helpers/config/envConfig";
import { storeAccessToken } from "@/lib/auth/session";

let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${getBaseUrl()}/auth/refresh`,
        undefined,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      )
      .then((response) => {
        const accessToken = response.data?.data?.accessToken;
        if (!accessToken) {
          throw new Error("Refresh response did not include access token");
        }
        storeAccessToken(accessToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};
