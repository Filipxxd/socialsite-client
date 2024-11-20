import authAxiosInstance from '../../shared/auth/authAxios.ts';
import { AxiosResponse } from "axios";

export interface ChatResponse {
  id: number;
  name: string;
  isDirect: boolean;
}

export const getChats = async (): Promise<AxiosResponse<ChatResponse[]>> => {
  return await authAxiosInstance.get<ChatResponse[]>('/chats/get-all');
};