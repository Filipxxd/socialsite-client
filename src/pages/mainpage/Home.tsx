import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Post from "./components/Post.tsx";
import UserSearchBar from "./components/UserSearchBar.tsx";

export default function Home(){
    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      console.log(event);
    };

    return (
        <>
          <UserSearchBar />
            <Post
             postId={7}
             userName={'Adolf Neadolf'}
             userPicturePath={'https://picsum.photos/200'}
             timestamp={new Date()}
             postText={'asdfasf asdf sadf asdf asdf asdf sadf a sa'}
             postPicturesPaths={['https://picsum.photos/200']}
            />

            <Stack spacing={2}>
                <Typography>Page: {page}</Typography>
                <Pagination count={10} page={page} onChange={handleChange} />
            </Stack>
        </>
    );
}