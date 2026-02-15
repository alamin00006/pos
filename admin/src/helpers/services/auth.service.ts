import {
  getFromLocalStorage,
  setToLocalStorage,
} from "@/helpers/utils/local-storage";

import { getBaseUrl } from "@/helpers/config/envConfig";
import { instance as axiosInstance } from "@/lib/axios/axiosInstance";
import { decodedToken } from "../utils/jwt";
import { authKey } from "@/constants/authKey";

// Type for the decoded token, adjust based on the actual structure of the decoded data
interface DecodedToken {
  [key: string]: any;
}

export const storeUserInfo = (accessToken: string): string | void => {
  return setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = (): DecodedToken | string => {
  if (typeof window === "undefined") {
    return ""; // Ensure not to run on the server
  }
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedData = decodedToken(authToken);
    return decodedData;
  } else {
    return "";
  }
};

export const isLoggedIn = (): boolean => {
  const authToken = getFromLocalStorage(authKey);
  return !!authToken;
};

export const getNewAccessToken = async (): Promise<any> => {
  try {
    const response = await axiosInstance({
      url: `${getBaseUrl()}/users/refresh-token`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    // Handle error appropriately, e.g., logging or rethrowing
    throw error;
  }
};
