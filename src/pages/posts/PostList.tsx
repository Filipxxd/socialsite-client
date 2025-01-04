import { Box, Center, Flex, Loader, Pagination, Text } from "@mantine/core";
import Post from "./components/Post.tsx";
import NoDataFound from "../../shared/NoDataFound.tsx";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { deletePost, getAllMainPagePosts, PostFilterVisibility, PostResponse } from "../../_api/posts.api.ts";
import { modals } from "@mantine/modals";
import { showErrorToast, showSuccessToast } from "../../_helpers/toasts.helper.ts";

export type PostListProps = {
  userId?: number| undefined;
  onlyCurrentUser: boolean;
  refetchPostsRef?: MutableRefObject<(() => void) | null>;
};

export default function PostsList({userId, onlyCurrentUser, refetchPostsRef}: PostListProps) {
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);

    await getAllMainPagePosts({
      pageNumber: page,
      pageSize: pageSize,
      visibility: PostFilterVisibility.FromEveryone,
      userId: userId,
      onlyCurrentUser: onlyCurrentUser
    })
      .then((res) => {
        setTotalPages(Math.ceil(res.data.totalRecords / pageSize));
        setPosts(res.data.items);
      });

    setPostsLoading(false);
  }, [page, pageSize, userId, onlyCurrentUser]);

  const handlePostDelete = async (post: PostResponse) => {
    modals.openConfirmModal({
      title: "Delete post",
      children: (
        <Text>Are you sure you want to delete?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await deletePost(post.postId)
          .then(() => {
            setPosts(posts.filter((p) => p.postId !== post.postId));
            showSuccessToast("Post deleted");
          })
          .catch(() => showErrorToast());
      },
    });
  }

  useEffect(() => {
    if (refetchPostsRef) {
      refetchPostsRef.current = fetchPosts;
    }
    void fetchPosts();
  }, [fetchPosts, refetchPostsRef]);

  return (
    <Box mt={"md"}>
      {postsLoading && <Loader size="xl" />}
      {!postsLoading && posts.length > 0 ? (
        <Flex justify={"center"} direction={"column"} align={"center"}>
          {posts.map((post) => (
            <Post
              key={post.postId}
              post={post}
              postDeleteCallback={handlePostDelete}
            />
          ))}
        </Flex>
      ) : (
        <NoDataFound title={"No posts to display"} message={"Try adding some friends"} />
      )}
      <Center>
        <Pagination
          mb="xl"
          total={totalPages}
          value={page}
          onChange={setPage}
        />
      </Center>
    </Box>
  );
}