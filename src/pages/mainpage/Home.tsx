import UserSearchBar from "./components/UserSearchBar.tsx";
import { Container } from "@mantine/core";
import CreatePost from "../posts/components/CreatePost.tsx";
import PostsList from "../posts/PostList.tsx";
import { useRef } from "react";

export default function Home() {
  const refetchPostsRef = useRef<() => void>(null);

  return (
    <Container>
      <UserSearchBar />
      <CreatePost onSuccess={async () => refetchPostsRef.current?.()} />
      <PostsList
        refetchPostsRef={refetchPostsRef}
        onlyCurrentUser={false}
      />
    </Container>
  );
}