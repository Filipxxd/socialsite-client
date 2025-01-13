import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Button,
  Flex,
  Box,
  Text,
  ActionIcon,
  TextInput, Divider
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FaTrash } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { showErrorToast, showSuccessToast } from "../../../_helpers/toasts.helper.ts";
import { formatDate } from "../../../_helpers/date.helper.ts";
import { CommentRequest, CommentResponse, createComment, deleteComment } from "../../../_api/comments.api.ts";
import { getPathOrNull } from "../../../_helpers/file.helper.ts";
import NoDataFound from "../../../shared/NoDataFound.tsx";

type PostCommentsProps = {
  commentsInput: CommentResponse[];
  postId: number;
};

export default function PostComments({ commentsInput, postId }: PostCommentsProps) {
  const [comments, setComments] = useState<CommentResponse[]>(commentsInput || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentsRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<CommentRequest>({
    initialValues: {
      content: "",
      postId: postId,
    },
    validate: {
      content: (value) => {
        if (!value) return "Comment must be supplied";
        if (value.length > 256) return "Comment must be less than 256 characters";
        return null;
      },
    },
  });

  const scrollToBottom = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId)
      .then(() => {
        setComments(comments.filter(comment => comment.commentId !== commentId));
        showSuccessToast("Comment deleted successfully");
      }).catch(() => showErrorToast());
  };

  const handleCreateComment = async (request: CommentRequest) => {
    setIsSubmitting(true);
    await createComment(request)
      .then((res) => {
        form.reset();
        setComments([...comments, res.data]);
        showSuccessToast("Comment added successfully");
      }).catch(() => showErrorToast());
    setIsSubmitting(false);
  };

  return (
    <>
      <Divider my={2}/>
      <Box
        ref={commentsRef}
        style={{ minHeight: '30vh', maxHeight: '30vh', overflowY: 'auto' }}
        mx={5}
      >
        {comments.length > 0 ? comments.map((comment) => (
          <Box key={comment.commentId} mb={16}>
            <Flex align={"center"}>
              <Avatar
                alt={comment.senderFullname}
                src={getPathOrNull(comment.senderProfilePicturePath)}
                radius="xl"
              />
              <Flex direction="column" ml={10} flex={1}>
                <Text fw={500}>{comment.senderFullname}</Text>
                <Text size="sm" c="dimmed">{formatDate(comment.dateCreated)}</Text>
              </Flex>
              {comment.canDelete && (
                <ActionIcon
                  variant="subtle"
                  onClick={() => handleDeleteComment(comment.commentId)}
                  size="sm"
                  children={<FaTrash />}
                />
              )}
            </Flex>
            <Text mt={4} size="sm">{comment.content}</Text>
          </Box>
        )) : (
          <NoDataFound title="No comments yet" />
        )}
      </Box>
      <form onSubmit={form.onSubmit(handleCreateComment)}>
        <Flex justify={"center"} align={"center"} p={5}>
          <TextInput
            placeholder="Write a comment..."
            w={"100%"}
            {...form.getInputProps("content")}
            mx={2}
          />
          <Button type="submit" loading={isSubmitting}>
            <IoSendSharp />
          </Button>
        </Flex>
      </form>
    </>
  );
}