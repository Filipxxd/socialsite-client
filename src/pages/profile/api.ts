import { AxiosResponse } from "axios";
import authAxiosInstance from "../../_auth/authAxios.ts";
import { PostResponse } from "../posts/api.ts";
import { FriendState } from "../friends/api.ts";

export enum FriendRequestSetting {
  AnyOne = 'Anyone',
  FriendsOfFriends = 'Only friends',
  NoOne = 'No one',
}

export type MyProfileResponse = {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  profilePicturePath: string;
  bio: string | null;
  allowNonFriendChatAdd: boolean;
  friendRequestSetting: FriendRequestSetting;
};

export const getProfileInfo = async (): Promise<AxiosResponse<MyProfileResponse>> => {
  return await authAxiosInstance.get<MyProfileResponse>('/api/users/my-profile');
};

export const updateProfileInfo = async (data: MyProfileResponse): Promise<AxiosResponse> => {
  return await authAxiosInstance.put('/api/users/update-profile', {
    firstname: data.firstname,
    lastname: data.lastname,
    bio: data.bio === "" ? null : data.bio,
    allowNonFriendChatAdd: data.allowNonFriendChatAdd,
    friendRequestSetting: data.friendRequestSetting
  });
}

export const updateProfileImage = async (imageData: string, fileName: string): Promise<AxiosResponse> => {
  return await authAxiosInstance.patch('/api/users/update-profile-picture', {
    Base64: imageData,
    Name: fileName
  });
};

export type UserProfileResponse = {
  userId: number;
  fullname: string;
  profilePicturePath: string;
  bio: string | null;
  friendState: FriendState;
  posts: PostResponse[];
}

export const getUserProfile = async (username: string): Promise<AxiosResponse<UserProfileResponse>> => {
  return await authAxiosInstance.get(`/api/users/profile/${username}`);
}
