import axios from 'axios';
import { API_BASE_URL } from '../../_constants/api.constants';

export interface LoginRequest {
  username: string;
  password: string;
}

export const login = async (values: LoginRequest) => {
    const response = await axios.post(`${API_BASE_URL}/account/login`, {
        Username: values.username, 
        Password: values.password
    });
    return response.data;
}

export interface RegisterRequest {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  passwordConfirm: string;
}

export const register = async (values: RegisterRequest) => {
    const response = await axios.post(`${API_BASE_URL}/account/register`, {
        Username: values.username, 
        FirstName: values.firstname, 
        LastName: values.lastname, 
        Password: values.password
    });
    return response.data;
}