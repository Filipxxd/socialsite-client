import { useState } from "react";
import { Avatar, Text, Button, Group, Paper, Flex } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { FaRegCommentDots, FaFlag } from "react-icons/fa";
import styles from './Post.module.css';
import { PostResponse } from "../api.ts";
import PostComments from "../../comments/components/PostComments.tsx";
import { getPathOrNull } from "../../../_helpers/file.helper.ts";

export default function Post(post: PostResponse) {
  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <Paper className={styles.card} shadow="sm" p="md" withBorder>
      <Flex mb="sm" align="center" justify="space-between">
        <Group align="center">
          <Avatar
            src={getPathOrNull(post.userProfilePicturePath)}
            alt={post.userFullname}
            size="md"
            radius="xl"
          />
          <div>
            <Text size="sm" fw={500}>{post.userFullname}</Text>
            <Text size="xs" c="dimmed">{new Date(post.dateCreated).toLocaleString()}</Text>
          </div>
        </Group>
        <Button
          size="sm"
          variant="subtle"
          children={<FaFlag />} />
      </Flex>
      {post.images.length > 0 && (
        <Carousel slideSize="100%" height="100%" slideGap="md" loop withIndicators className={styles.carouselContainer}>
          {post.images.map((image, index) => (
            <Carousel.Slide key={index} className={styles.slide}>
              <img
                src={`data:image/jpeg;base64,${image.base64}`}
                alt={image.name}
                className={styles.slideImage}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
      <Text size="sm" mb="xs">{post.content}</Text>
      <Group>
        <Button
          fullWidth
          variant="subtle"
          mt="xs"
          onClick={() => setCommentsOpen((prev) => !prev)}
          leftSection={<FaRegCommentDots />}
        >
          {commentsOpen ? "Hide" : "Show"} Comments
        </Button>
      </Group>
      {commentsOpen && <PostComments commentsInput={post.comments} postId={post.postId} />}
    </Paper>
  );
}