import { useState } from "react";
import { Avatar, Text, Button, Group, Paper, Box } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { FaRegCommentDots, FaFlag } from "react-icons/fa";
import styles from './Post.module.css';
import { PostResponse } from "../api.ts";
import { API_BASE_URL } from "../../../_constants/api.constants.ts";
import PostComments from "../../comments/components/PostComments.tsx";

export default function Post(post: PostResponse) {
  const hasImages = post.images.length > 0;
  const [commentsOpen, setCommentsOpen] = useState(false);
  const toggleComments = () => {
    setCommentsOpen(prev => !prev);
  };

  return (
    <Paper className={styles.card} shadow="sm" p="md" withBorder>
      <Group mb="sm" align="center">
        <Avatar
          src={API_BASE_URL + post.userProfilePicturePath}
          alt={post.userFullname}
          size="md"
          radius="xl"
        />
        <div>
          <Text size="sm" fw={500}>{post.userFullname}</Text>
          <Text size="xs" c="dimmed">{new Date(post.dateCreated).toLocaleString()}</Text>
        </div>
      </Group>
      <Box className={styles.carouselContainer} mb="sm">
        {hasImages ? (
          <Carousel slideSize="100%" height="100%" slideGap="md" loop withIndicators>
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
        ) : (
          <Text className={styles.noImages} c="dimmed">No Images Available</Text>
        )}
      </Box>
      <Text size="sm" mb="xs">{post.content}</Text>
      <Group>
        <Button
          size="xs"
          variant="subtle"
          onClick={toggleComments}
        >
          <FaRegCommentDots /> Comment
        </Button>
        <Button
          size="xs"
          variant="subtle"
        >
          <FaFlag /> Report
        </Button>
      </Group>
      {commentsOpen && <PostComments commentsInput={post.comments} postId={post.postId} />}
    </Paper>
  );
}