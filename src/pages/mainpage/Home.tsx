import { useState, useEffect, useCallback } from "react";
import { getAllMainPagePosts, PostResponse, PostFilterVisibility } from "../posts/api.ts";
import Post from "../posts/components/Post.tsx";
import UserSearchBar from "./components/UserSearchBar.tsx";
import { Loader, Container, Center, Flex, Pagination } from "@mantine/core";
import CreatePost from "../posts/components/CreatePost.tsx";
import NoDataFound from "../../shared/NoDataFound.tsx";

export default function Home() {
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
    })
      .then((res) => {
        setTotalPages(Math.ceil(res.data.totalRecords / pageSize));
        setPosts(res.data.items);
      });

    setPostsLoading(false);
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
        <NoDataFound title={"No posts to display"} message={"Try adding some friends"}/>
      )}
      <Center>
        <Pagination
          mb="xl"
          total={totalPages}
          value={page}
          onChange={setPage}
        />
      </Center>
    </Container>
  );
}