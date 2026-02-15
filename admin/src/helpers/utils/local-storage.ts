export const setToLocalStorage = (
  key: string,
  token: string,
): void | string => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.setItem(key, token);
};

export const getFromLocalStorage = (key: string): string | null => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(key);
};

export const removeUserInfo = (key: string): void | string => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(key);
  }
  return "";
};

export const setUserVerificationData = (
  userDataKey: string,
  otpData: any,
): void | string => {
  if (!userDataKey || typeof window === "undefined") {
    return "";
  }
  localStorage.setItem(userDataKey, JSON.stringify(otpData));
};

export const getUserVerificationData = (userDataKey: string): any => {
  if (!userDataKey || typeof window === "undefined") {
    return "";
  }
  const parseData = localStorage.getItem(userDataKey);
  return parseData ? JSON.parse(parseData) : null;
};

export const removeUserVerificationData = (
  userDataKey: string,
): void | string => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(userDataKey);
  }
  return "";
};
