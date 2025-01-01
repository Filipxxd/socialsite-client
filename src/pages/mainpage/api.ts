import { AxiosResponse } from "axios";
import authAxiosInstance from "../../_auth/authAxios.ts";

export type SearchUsersResponse = {
  totalRecordsCount: number;
  items: SearchUserResponse[];
}

export type SearchUserResponse = {
  username: string;
  fullname: string;
  profilePicturePath: string | null;
}

export const searchUsers = async (searchTerm: string): Promise<AxiosResponse<SearchUsersResponse>> => {
  return await authAxiosInstance.get(`/api/users/search?searchTerm=${searchTerm}`);
};
