import axios from "axios";
import {API_BASE_URL} from "../../_constants/api.constants.tsx";

export enum PostVisibility {
    Anyone = 'Anyone',
    Friends = 'Friends',
    Private = 'Private',
}

export interface CreatePostRequest {
    content: string;
    images: File[];
    visibility: PostVisibility;
}

export const createPost = async (values: CreatePostRequest) => {
    // TODO: Use AuthAxiosInstance
    return await axios.post(`${API_BASE_URL}/posts`, {
        Content: values.content,
        Visibility: values.visibility,
        Images: values.images
    });
}

export interface UpdatePostRequest extends CreatePostRequest {
    postId: number;
}

export const updatePost = async (values: UpdatePostRequest) => {
    // TODO: Use AuthAxiosInstance
    return await axios.put(`${API_BASE_URL}/posts/${values.postId}`, {
        Content: values.content,
        Visibility: values.visibility,
        Images: values.images
    });
}

export const deletePost = async (postId: number) => {
    // TODO: Use AuthAxiosInstance
    return await axios.delete(`${API_BASE_URL}/posts`, {
        params: { postId },
    });
}

export interface CommentResponse{
    commentId: number;
    content: string;
    userFullName: string;
    dateCreated: Date;
}

export interface PostResponse{
    postId: number;
    content: string;
    images: File[];
    dateCreated: Date;
    userFullName: string;
    comments: CommentResponse[];
}

export const getAllMainPagePosts = async () => {
    // TODO: Use AuthAxiosInstance
    return await axios.get<PostResponse[]>(`${API_BASE_URL}/posts`);
}
