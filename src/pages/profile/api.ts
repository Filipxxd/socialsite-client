import { AxiosResponse } from "axios";
import authAxiosInstance from "../../shared/auth/authAxios.ts";

export type MyProfileResponse = {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  profilePicturePath: string;
  bio: string | null;
  allowNonFriendChatAdd: boolean;
  friendRequestSetting: string;
};

export const getProfileInfo = async (): Promise<AxiosResponse<MyProfileResponse>> => {
  return await authAxiosInstance.get<MyProfileResponse>('/user/my-profile');
};

export const updateProfileInfo = async (data: MyProfileResponse): Promise<AxiosResponse> => {
  return await authAxiosInstance.put('/user/update-profile', {
    firstname: data.firstname,
    lastname: data.lastname,
    bio: data.bio === "" ? null : data.bio,
    allowNonFriendChatAdd: data.allowNonFriendChatAdd,
    friendRequestSetting: data.friendRequestSetting
  });
}