export type JwtPayload = {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
};

export const decodedToken = (token: string): JwtPayload => {
  const payload = token.split(".")[1];
  if (!payload) return {};
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return {};
  }
};
