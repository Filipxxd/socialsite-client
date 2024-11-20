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
    return await axios.post(`${API_BASE_URL}/posts/create`, {
        Content: values.content,
        Images: values.images
    });
}
