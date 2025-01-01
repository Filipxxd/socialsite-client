import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import { Carousel } from "@mantine/carousel";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import FlagIcon from "@mui/icons-material/Flag";
import { PostResponse } from "../api.ts";
import { API_BASE_URL } from "../../../_constants/api.constants.ts";
import { formatDate } from "../../../_helpers/date.helper.ts";

export default function Post(post: PostResponse) {
  const hasImages = post.images.length > 0;

  return (
    <Card sx={{ width: 345, marginBottom: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            aria-label={post.userFullname}
            src={API_BASE_URL + post.userProfilePicturePath}
            alt={post.userFullname}
          />
        }
        title={post.userFullname}
        subheader={formatDate(post.dateCreated)}
      />
      <div style={{ height: "10rem" }}>
        {hasImages ? (
          <Carousel
            slideSize="100%"
            height="100%"
            slideGap="md"
            loop
            withIndicators
          >
            {post.images.map((image, index) => (
              <Carousel.Slide key={index} style={{textAlign: "center"}}>
                <img
                  src={`data:image/jpeg;base64,${image.base64}`}
                  alt={image.name}
                  style={{
                    maxHeight: "10rem"
                  }}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              backgroundColor: "#f0f0f0",
              color: "#aaa",
              fontSize: "1.2rem",
            }}
          >
            No Images Available
          </div>
        )}
      </div>
      <CardContent>
        <Typography variant="body2">
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add comment">
          <InsertCommentIcon />
        </IconButton>
        <IconButton aria-label="report">
          <FlagIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}