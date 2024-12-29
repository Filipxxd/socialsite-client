import { AxiosResponse } from "axios";
import authAxiosInstance from "../../shared/auth/authAxios.ts";

export type SearchUserResponse = {
  username: string;
  fullname: string;
  profilePicturePath: string;
}

export const searchUsers = async (searchTerm: string): Promise<AxiosResponse<SearchUserResponse[]>> => {
  return await authAxiosInstance.get(`/api/users/search?searchTerm=${searchTerm}`);
};
