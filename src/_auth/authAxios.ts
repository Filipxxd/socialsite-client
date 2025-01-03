import axios from 'axios';
import { API_BASE_URL } from '../_constants/api.constants.ts';
import { isAccessTokenExpired } from './auth.utils.ts';
import { getAccessToken, getRefreshToken, setTokens, loadTokensFromStorage } from './tokenManager.ts';
import { emit } from './authEventEmitter.ts';

loadTokensFromStorage();

const authAxiosInstance = axios.create({
  baseURL: API_BASE_URL
});

let isRefreshing = false;
let refreshSubscribers: ((newToken: string) => void)[] = [];

const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const subscribeTokenRefresh
  = (callback: (newToken: string) => void) => refreshSubscribers.push(callback);

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    emit('logout');
    return Promise.reject("Refresh token is missing");
  }

  if (isRefreshing)
    return new Promise((resolve) => subscribeTokenRefresh(resolve));

  isRefreshing = true;
  let accessToken: string | null = null;

  await axios.post(`${API_BASE_URL}/api/account/refresh-token`, { Token: refreshToken, })
    .then((response) => {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      setTokens(newAccessToken, newRefreshToken);
      onRefreshed(newAccessToken);

      accessToken = newAccessToken;
    }).catch(() => {
      emit('logout');
    });

  isRefreshing = false;
  return accessToken;
};

authAxiosInstance.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    if (token && isAccessTokenExpired(token)) {
      await refreshAccessToken()
        .then((newToken) => token = newToken)
        .catch(() => {
          emit('logout');
          return Promise.reject("Session expired");
        });
    }

    if (token)
      config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authAxiosInstance;