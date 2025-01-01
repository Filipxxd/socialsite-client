import { JWT_Access_Token, JWT_Refresh_Token } from '../../_constants/localStorage.constants';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export const setTokens = (newAccessToken: string, newRefreshToken: string) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  localStorage.setItem(JWT_Access_Token, newAccessToken);
  localStorage.setItem(JWT_Refresh_Token, newRefreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem(JWT_Access_Token);
  localStorage.removeItem(JWT_Refresh_Token);
};

export const loadTokensFromStorage = () => {
  accessToken = localStorage.getItem(JWT_Access_Token);
  refreshToken = localStorage.getItem(JWT_Refresh_Token);
};