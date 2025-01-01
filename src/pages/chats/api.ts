import authAxiosInstance from '../../_auth/authAxios.ts';
import { AxiosResponse } from "axios";

export type ChatResponse = {
  chatId: number;
  name: string;
  isDirect: boolean;
}

export const getChats = async (): Promise<AxiosResponse<ChatResponse[]>> => {
  return await authAxiosInstance.get<ChatResponse[]>('/api/chats/get-all');
};