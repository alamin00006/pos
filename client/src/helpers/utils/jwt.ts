import { jwtDecode, JwtPayload } from "jwt-decode";

// You can extend JwtPayload if your token has additional fields
export const decodedToken = (token: string): JwtPayload => {
  return jwtDecode<JwtPayload>(token);
};
