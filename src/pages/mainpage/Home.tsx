import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Post from "./components/Post.tsx";
import {getAllMainPagePosts, PostResponse} from "../posts/api.ts";
import UserSearchBar from "./components/UserSearchBar.tsx";

export default function Home(){
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [posts, setPosts] = useState<PostResponse[]>([]);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      console.log(event);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getAllMainPagePosts({pageNumber: page, pageSize: size});
            if (response.status === 200){
                setTotalPages(response.data.totalPages);
                setPosts(response.data.items);
            }
        };

        void fetchPosts()
    }, [page, size]);

    return (
        <>
          <UserSearchBar />
            {posts.map((post) => (
                <Post
                    postId={post.postId}
                    userName={post.userFullName}
                    userPicturePath={""}// TODO: user picture
                    timestamp={post.dateCreated}
                    postText={post.content}
                    postPicturesPaths={['https://picsum.photos/200']} // TODO: map files into urls
                />
            ))}

            <Stack spacing={2}>
                <Typography>Page: {page}</Typography>
                <Pagination count={10} page={page} onChange={handleChange} />
            </Stack>
        </>
    );
}