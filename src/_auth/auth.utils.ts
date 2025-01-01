import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  exp: number;
}

export const isAccessTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
};