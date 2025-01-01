import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography
} from "@mui/material";
import { Carousel } from "@mantine/carousel";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import FlagIcon from "@mui/icons-material/Flag";
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
    <Card className={styles.card}>
      <CardHeader
        avatar={
          <Avatar
            aria-label={post.userFullname}
            src={API_BASE_URL + post.userProfilePicturePath}
            alt={post.userFullname}
          />
        }
        title={post.userFullname}
        subheader={new Date(post.dateCreated).toLocaleString()}
      />
      <div className={styles.carouselContainer}>
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
          <div className={styles.noImages}>No Images Available</div>
        )}
      </div>
      <CardContent>
        <Typography variant="body2">{post.content}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add comment" onClick={toggleComments}>
          <InsertCommentIcon />
        </IconButton>
        <IconButton aria-label="report">
          <FlagIcon />
        </IconButton>
      </CardActions>
      {commentsOpen && <PostComments commentsInput={post.comments} postId={post.postId} /> }
    </Card>
  );
}