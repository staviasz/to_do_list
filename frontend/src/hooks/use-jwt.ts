import { jwtDecode } from "jwt-decode";

export function useJWT(jwt: string) {
  return { payload: jwtDecode(jwt) };
}
