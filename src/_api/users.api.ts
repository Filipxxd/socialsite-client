﻿import authAxiosInstance from "../_auth/authAxios.ts";
import { FriendState } from "./friends.api.ts";
import { PostResponse } from "./posts.api.ts";

export type SearchUsersRequest = {
  searchTerm?: string;
  pageSize: number;
  pageNumber: number;
}

export type SearchUsersResponse = {
  totalRecords: number;
  items: UserResponse[];
}

export type UserResponse = {
  userId: number;
  username: string;
  role: string;
  isBanned: boolean;
  fullname: string;
  profilePicturePath: string | null;
}

export const searchUsers = async (filter: SearchUsersRequest) => {
  const params = new URLSearchParams({
    PageSize: filter.pageSize.toString(),
    PageNumber: filter.pageNumber.toString(),
    ...(filter.searchTerm && { Visibility: filter.searchTerm }),
  });

  return await authAxiosInstance.get<SearchUsersResponse>(`/api/users/search?${params}`);
};

export const banUser = async (userId: number, banned: boolean) => {
  return await authAxiosInstance.patch(`/api/users/${userId}?banned=${banned}`);
}

export enum UserRole {
  Admin = "Admin",
  Moderator = "Moderator",
  User = "User",
}

export const changeUserRole = async (userId: number, role: UserRole) => {
  return await authAxiosInstance.patch(`/api/users/${userId}/role?role=${role}`);
}

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

export const getProfileInfo = async () => {
  return await authAxiosInstance.get<MyProfileResponse>('/api/users/my-profile');
};

export const updateProfileInfo = async (data: MyProfileResponse) => {
  return await authAxiosInstance.put('/api/users/update-profile', {
    firstname: data.firstname,
    lastname: data.lastname,
    bio: data.bio === "" ? null : data.bio,
    allowNonFriendChatAdd: data.allowNonFriendChatAdd,
    friendRequestSetting: data.friendRequestSetting
  });
}

export const updateProfileImage = async (imageData: string, fileName: string) => {
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

export const getUserProfile = async (username: string)=> {
  return await authAxiosInstance.get<UserProfileResponse>(`/api/users/profile/${username}`);
}
