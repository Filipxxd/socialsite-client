import authAxiosInstance from "../../_auth/authAxios.ts";
import { CommentResponse } from "../comments/api.ts";
import { PaginatedResponse } from "../../_helpers/pagination.helper.ts";

export enum PostVisibility {
    Everyone = "Everyone",
    FriendsOnly = "Friends",
    Private = "Private",
}

export type CreatePostRequest = {
    content: string;
    images: { name: string, base64: string }[];
    visibility: PostVisibility;
}

export const createPost = async (data: CreatePostRequest) => {
    return await authAxiosInstance.post(`/api/posts/create`, {
        Content: data.content,
        Visibility: data.visibility,
        Images: data.images
    });
}

export type UpdatePostRequest = CreatePostRequest & {
    postId: number;
}

export const updatePost = async (data: UpdatePostRequest) => {
    return await authAxiosInstance.put(`/api/posts/${data.postId}`, {
        Content: data.content,
        Visibility: data.visibility,
        Images: data.images
    });
}

export const deletePost = async (postId: number) => {
    return await authAxiosInstance.delete(`/api/posts`, {
        params: { postId },
    });
}

export type PostResponse = {
    postId: number;
    userFullname: string;
    userProfilePicturePath: string | null;
    dateCreated: Date;
    content: string;
    images: { name: string, base64: string }[];
    comments: CommentResponse[];
}

export type PaginationRequest = {
  pageNumber: number;
  pageSize: number;
}

export enum PostFilterVisibility
{
  FromFriends = "FromFriends",
  FromEveryone = "FromEveryone"
}

export type PostFilter = {
  visibility?: PostFilterVisibility;
  userId?: number;
  onlyCurrentUser?: boolean;
  pageNumber: number;
  pageSize: number;
}

export const getAllMainPagePosts = async (filter: PostFilter) => {
    const params = new URLSearchParams({
      PageSize: filter.pageSize.toString(),
      PageNumber: filter.pageNumber.toString(),
      ...(filter.visibility && { Visibility: filter.visibility.toString() }),
      ...(filter.userId && { UserId: filter.userId.toString() }),
      ...(filter.onlyCurrentUser && { OnlyCurrentUser: filter.onlyCurrentUser.toString() })
    });

    return await authAxiosInstance.get<PaginatedResponse<PostResponse>>(`/api/posts/get-all?${params}`);
};
