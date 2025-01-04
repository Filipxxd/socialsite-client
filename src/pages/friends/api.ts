import authAxiosInstance from '../../_auth/authAxios.ts';
import { AxiosResponse } from "axios";

export enum FriendState {
  Friends = 'Friends',
  CanSendRequest = 'CanSendRequest',
  RequestSent = 'RequestSent',
  RequestReceived = 'RequestReceived',
}

export type FriendResponse = {
  friendId: number;
  friendFullname: string;
  profilePicturePath: string | null;
  friendsSince: Date;
}

export const getFriends = async (): Promise<AxiosResponse<FriendResponse[]>> => {
  return await authAxiosInstance.get<FriendResponse[]>('/api/friends');
};

export type FriendRequestResponse = {
  friendRequestId: number;
  senderFullname: string;
  profilePicturePath: string | null;
  sentAt: Date;
}

export const getFriendRequests = async (): Promise<AxiosResponse<FriendRequestResponse[]>> => {
  return await authAxiosInstance.get<FriendRequestResponse[]>('/api/friends/requests');
};

export type ResolveFriendRequest = {
  friendRequestId: number;
  isAccept: boolean;
}

export const resolveFriendRequest = async (data: ResolveFriendRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.put('/api/friends/request', {
    FriendRequestId: data.friendRequestId,
    IsAccepted: data.isAccept
  });
};

export const removeFriend = async (friendId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.delete(`/api/friends/${friendId}`);
};

export const sendFriendRequest = async (userId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(`/api/friends/request/${userId}`);
}

export const revokeFriendRequest = async (userId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.delete(`/api/friends/request/${userId}`);
}
