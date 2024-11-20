import axios from 'axios';
import { API_BASE_URL } from '../../_constants/api.constants';
import { isAccessTokenExpired } from './auth.utils.ts';
import { getAccessToken, getRefreshToken, setTokens, loadTokensFromStorage } from './tokenManager';

loadTokensFromStorage();

const authAxiosInstance = axios.create({
  baseURL: API_BASE_URL
});

authAxiosInstance.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    if (token && isAccessTokenExpired(token)) {
      token = await refreshAccessToken();

      if (!token)
        return Promise.reject("Session expired");
    }

    if (token)
      config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken)
    return Promise.reject("Refresh token is missing");

  try {
    const response = await axios.post(`${API_BASE_URL}/refresh-token`, {
      refreshToken,
    });

    if (response.status !== 200)
      return Promise.reject("Failed to refresh token");

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
    setTokens(newAccessToken, newRefreshToken);

    return newAccessToken;
  } catch (err) {
    return Promise.reject(err);
  }
};

export default authAxiosInstance;