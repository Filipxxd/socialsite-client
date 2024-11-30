import {API_BASE_URL} from "../../_constants/api.constants.tsx";
import authAxiosInstance from "../../shared/auth/authAxios.ts";

export enum PostVisibility {
    Anyone = 'Anyone',
    Friends = 'Friends',
    Private = 'Private',
}

export type CreatePostRequest = {
    content: string;
    images: File[];
    visibility: PostVisibility;
}

export const createPost = async (data: CreatePostRequest) => {
    return await authAxiosInstance.post(`${API_BASE_URL}/posts`, {
        Content: data.content,
        Visibility: data.visibility,
        Images: data.images
    });
}

export type UpdatePostRequest = CreatePostRequest & {
    postId: number;
}

export const updatePost = async (data: UpdatePostRequest) => {
    return await authAxiosInstance.put(`${API_BASE_URL}/posts/${data.postId}`, {
        Content: data.content,
        Visibility: data.visibility,
        Images: data.images
    });
}

export const deletePost = async (postId: number) => {
    return await authAxiosInstance.delete(`${API_BASE_URL}/posts`, {
        params: { postId },
    });
}

export type CommentResponse = {
    commentId: number;
    content: string;
    userFullName: string;
    dateCreated: Date;
}

export type PostResponse = {
    postId: number;
    content: string;
    images: File[];
    dateCreated: Date;
    userFullName: string;
    comments: CommentResponse[];
}

export const getAllMainPagePosts = async () => {
    return await authAxiosInstance.get<PostResponse[]>(`${API_BASE_URL}/posts`);
}
