import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

export const isAccessTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp < Math.floor(Date.now() / 1000);
  } catch (err) {
    console.error("Token is invalid or reading failure", err);
    return true;
  }
};