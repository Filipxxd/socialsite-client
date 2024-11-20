import axios, { AxiosResponse } from "axios";
import authAxios from "../../shared/auth/authAxios.ts";
import { API_BASE_URL } from '../../_constants/api.constants';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (values: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
  return await axios.post(`${API_BASE_URL}/account/login`, {
        Username: values.username, 
        Password: values.password,
        RememberMe: values.rememberMe
    });
}

export interface RegisterRequest {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  passwordConfirm: string;
}

export const register = async (values: RegisterRequest) => {
  return await axios.post(`${API_BASE_URL}/account/register`, {
        Username: values.username, 
        FirstName: values.firstname, 
        LastName: values.lastname, 
        Password: values.password
    });
}

export const logout = async (refreshToken: string) => {
  return await authAxios.post(`${API_BASE_URL}/account/logout`, {
    Token: refreshToken
  });
}