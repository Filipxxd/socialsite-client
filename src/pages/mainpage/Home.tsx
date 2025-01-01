import { useState, useEffect, useCallback } from "react";
import { getAllMainPagePosts, PostResponse, PostFilterVisibility } from "../posts/api.ts";
import Post from "../posts/components/Post.tsx";
import UserSearchBar from "./components/UserSearchBar.tsx";
import { Loader, Container, Center, Flex, Text, Pagination } from "@mantine/core";
import CreatePost from "../posts/components/CreatePost.tsx";

export default function Home() {
  const pageSize = 2;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const response = await getAllMainPagePosts({
        pageNumber: page,
        pageSize: pageSize,
        visibility: PostFilterVisibility.FromEveryone,
      });
      if (response.status === 200) {
        setTotalPages(Math.ceil(response.data.totalRecords / pageSize));
        setPosts(response.data.items);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setPostsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  return (
    <Container>
      <UserSearchBar />
      <CreatePost onSuccess={fetchPosts} />
      {postsLoading && <Loader size="xl" />}
      {!postsLoading && posts.length > 0 ? (
        <Flex wrap="wrap" justify="center" gap="md">
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
        <Text size="lg" c="dimmed">
          Nothing here
        </Text>
      )}
      <Center>
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
        />
      </Center>
    </Container>
  );
}