import authAxiosInstance from "../../_auth/authAxios.ts";

export type CommentRequest = {
  postId: number;
  content: string;
}

export type CommentResponse = {
  commentId: number;
  content: string;
  senderFullname: string;
  dateCreated: Date;
  canDelete: boolean;
  senderProfilePicturePath: string | null;
}

export const createComment = async (data: CommentRequest) => {
  return await authAxiosInstance.post<CommentResponse>(`/api/comments`, {
    PostId: data.postId,
    Content: data.content
  });
}

export const deleteComment = async (commentId: number) => {
  return await authAxiosInstance.delete(`/api/comments`, {
    params: { commentId },
  });
}