import { AxiosResponse } from "axios";
import authAxiosInstance from "../../shared/auth/authAxios.ts";
import { API_BASE_URL } from "../../_constants/api.constants.tsx";

export type SearchUserResponse = {
  username: string;
  fullname: string;
  profilePicturePath: string;
}

export const getFriends = async (searchTerm: string): Promise<AxiosResponse<SearchUserResponse[]>> => {
  return await authAxiosInstance.get(`${API_BASE_URL}/user/search-users?searchTerm=${searchTerm}`);
};
