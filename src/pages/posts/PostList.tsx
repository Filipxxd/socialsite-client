import { Box, Center, Flex, Loader, Pagination } from "@mantine/core";
import Post from "./components/Post.tsx";
import NoDataFound from "../../shared/NoDataFound.tsx";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { getAllMainPagePosts, PostFilterVisibility, PostResponse } from "../../_api/posts.api.ts";

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
              postId={post.postId}
              userFullname={post.userFullname}
              userProfilePicturePath={post.userProfilePicturePath}
              dateCreated={post.dateCreated}
              content={post.content}
              images={post.images}
              comments={post.comments}
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