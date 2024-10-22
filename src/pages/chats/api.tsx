import axios from "axios";
import { API_BASE_URL } from "../../_constants/api.constants";

export interface ChatInfo {
  id: number;
  name: string;
  isDirect: boolean;
}

export const getChats = async (token: string | null): Promise<ChatInfo[]> => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `bearer ${token}`,
    },
  });

  const response = await axiosInstance.get<ChatInfo[]>(`/chats/get-all`);
  return response.data;
};
