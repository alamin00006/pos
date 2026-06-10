import { authKey } from "@/constants/authKey";
import { decodedToken } from "@/helpers/utils/jwt";
import {
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/lib/utils/local-storage";

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";
export const AUTH_TOKEN_REFRESHED_EVENT = "auth:token-refreshed";

export const isTokenExpired = (token?: string | null) => {
  if (!token) return true;
  const { exp } = decodedToken(token);
  if (!exp || typeof exp !== "number") return true;
  return exp * 1000 <= Date.now();
};

export const getTokenExpiryTime = (token?: string | null) => {
  if (!token) return null;
  const { exp } = decodedToken(token);
  return exp && typeof exp === "number" ? exp * 1000 : null;
};

export const clearStoredAuthSession = () => {
  removeFromLocalStorage(authKey);
  removeFromLocalStorage("selectedBranchId");
  removeFromLocalStorage("pos_user");
};

export const storeAccessToken = (accessToken: string) => {
  setToLocalStorage(authKey, accessToken);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_TOKEN_REFRESHED_EVENT, { detail: { accessToken } }),
    );
  }
};

export const expireAuthSession = () => {
  clearStoredAuthSession();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
  }
};
