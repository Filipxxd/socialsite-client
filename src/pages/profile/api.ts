import { AxiosResponse } from "axios";
import authAxiosInstance from "../../shared/auth/authAxios.ts";
import { PostResponse } from "../posts/api.ts";

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

export enum FriendState {
  Friends = 'Friends',
  CanSendRequest = 'CanSendRequest',
  CannotSendRequest = 'CannotSendRequest',
  RequestSent = 'RequestSent',
  RequestReceived = 'RequestReceived',
}

export type UserProfileResponse = {
  userId: number;
  fullname: string;
  profilePicturePath: string;
  bio: string | null;
  friendState: FriendState;
  posts: PostResponse[];
}

export const getUserProfile = async (username: string): Promise<AxiosResponse<UserProfileResponse>> => {
  return await authAxiosInstance.get(`/user/profile/${username}`);
}

export const sendFriendRequest = async (userId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(`/friends/send-request/${userId}`);
}

export const revokeFriendRequest = async (userId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.delete(`/friends/revoke-request/${userId}`);
}
