import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import FlagIcon from '@mui/icons-material/Flag';

interface PostProps {
  postId: number,
  userPicturePath: string,
  userName: string,
  timestamp: Date,
  postPicturesPaths: Array<string>,
  postText: string,
}

export default function Post({
  postId,
  userPicturePath,
  userName,
  timestamp,
  postPicturesPaths,
  postText
}: PostProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            userPicturePath
          </Avatar>
        }
        title={userName}
        subheader={timestamp.toDateString()}
      />
      <CardMedia
        component="img"
        height="194"
        image={postPicturesPaths[0]}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {postText}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="Add comment">
          <InsertCommentIcon />
        </IconButton>
        <IconButton aria-label="Report">
          <FlagIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
