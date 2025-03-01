import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from '../_constants/api.constants.ts';
import authAxiosInstance from "../_auth/authAxios.ts";

export type LoginRequest = {
  username: string;
  password: string;
  rememberMe: boolean;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
}

export const login = async (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
  return await axios.post(`${API_BASE_URL}/api/account/login`, {
        Username: data.username,
        Password: data.password,
        RememberMe: data.rememberMe
    });
}

export type RegisterRequest = {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  passwordConfirm: string;
}

export const register = async (data: RegisterRequest) => {
  return await axios.post(`${API_BASE_URL}/api/account/register`, {
        Username: data.username,
        FirstName: data.firstname,
        LastName: data.lastname,
        Password: data.password
    });
}

export const logout = async (refreshToken: string) => {
  return await authAxiosInstance.post(`/api/account/logout`, {
    Token: refreshToken
  });
}