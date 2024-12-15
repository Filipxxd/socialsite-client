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
    return await authAxiosInstance.post(`/posts`, {
        Content: data.content,
        Visibility: data.visibility,
        Images: data.images
    });
}

export type UpdatePostRequest = CreatePostRequest & {
    postId: number;
}

export const updatePost = async (data: UpdatePostRequest) => {
    return await authAxiosInstance.put(`/posts/${data.postId}`, {
        Content: data.content,
        Visibility: data.visibility,
        Images: data.images
    });
}

export const deletePost = async (postId: number) => {
    return await authAxiosInstance.delete(`/posts`, {
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

export type PaginatedResponse = {
  totalRecords: number;
  totalPages: number;
  items: PostResponse[];
}

export type PaginationRequest = {
  pageNumber: number;
  pageSize: number;
}

export const getAllMainPagePosts = async (data: PaginationRequest) => {
  return await authAxiosInstance.get<PaginatedResponse>(`/posts?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`);
}
