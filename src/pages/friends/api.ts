import authAxiosInstance from '../../shared/auth/authAxios.ts';
import { AxiosResponse } from "axios";

export type FriendResponse = {
  friendId: number;
  friendFullname: string;
  friendsSince: Date;
}

export const getFriends = async (): Promise<AxiosResponse<FriendResponse[]>> => {
  return await authAxiosInstance.get<FriendResponse[]>('/api/user/friends/get-all-friends');
};

export type FriendRequestResponse = {
  friendRequestId: number;
  senderFullname: string;
  sentAt: Date;
}

export const getFriendRequests = async (): Promise<AxiosResponse<FriendRequestResponse[]>> => {
  return await authAxiosInstance.get<FriendRequestResponse[]>('/api/user/friends/get-all-friend-requests');
};

export type FriendRequest = {
  receiverId: number;
}

export const sendFriendRequest = async (data: FriendRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post('/api/user/friends/send-request', {
    ReceiverId: data.receiverId
  });
};

export type ResolveFriendRequest = {
  friendRequestId: number;
  accept: boolean;
}

export const resolveFriendRequest = async (data: ResolveFriendRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.put('/api/user/friends/resolve-request', {
    Id: data.friendRequestId,
    IsAccepted: data.accept
  });
};

export type RemoveFriendRequest = {
  friendId: number;
}

export const removeFriend = async (friendId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.delete(`/api/user/friends/remove-friend/${friendId}`);
};
