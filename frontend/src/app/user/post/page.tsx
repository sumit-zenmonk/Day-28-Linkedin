"use client";

import { useEffect, useState } from "react";
import { getPosts, deletePost, interactWithPost } from "@/redux/feature/user/Post/postAction";
import styles from "./post.module.css";
import { Card, CardContent, Typography, Avatar, IconButton, CircularProgress, Box, Button, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function PostList() {
    const dispatch = useAppDispatch();
    const { posts, loading, totalDocuments } = useAppSelector((state: RootState) => state.postReducer);
    const user = useAppSelector((state: RootState) => state.authReducer.user);
    const [page, setPage] = useState(1);
    const router = useRouter()

    useEffect(() => {
        dispatch(getPosts({ page, limit: LIMIT }));
    }, [dispatch, page]);

    const fetchMoreData = () => {
        if (loading) return;

        if (posts.length < totalDocuments) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePostInteract = async (post_uuid: string) => {
        try {
            const result = await dispatch(interactWithPost(post_uuid)).unwrap();
            await dispatch(getPosts({ page, limit: LIMIT })).unwrap();
            enqueueSnackbar(result, { variant: "success" });
        } catch (err) {
            console.error(err);
        }
    };

    const isAlreadyLiked = (liked_byArray: any) => {
        return liked_byArray.some((his: any) => his.user_uuid === user?.uid);
    };

    return (
        <Box className={styles.container}>
            {(posts?.length != 0 &&
                <Box className={styles.scrollContainer} id="scrollableDiv">
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={fetchMoreData}
                        hasMore={posts.length < totalDocuments}
                        loader={
                            <Box className={styles.loader}>
                                <CircularProgress />
                            </Box>
                        }
                        scrollableTarget="scrollableDiv"
                    >
                        <Box className={styles.flexWrap}>
                            {posts.map((post) => (
                                <Card key={post.uuid} className={styles.card}>
                                    <CardContent className={styles.cardContent}>
                                        <Box className={styles.header}>
                                            <Box className={styles.userInfo}>
                                                <Avatar
                                                    src={post.user?.profile?.profile_img?.image_url || ""}
                                                    className={styles.avatar}
                                                >
                                                    {post.user.name[0]}
                                                </Avatar>

                                                <Box>
                                                    <Typography className={styles.username}>
                                                        {post.user.name}
                                                    </Typography>
                                                    <Typography className={styles.date}>
                                                        {new Date(post.created_at).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <IconButton onClick={() => dispatch(deletePost(post.uuid))}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>

                                        <Typography className={styles.content}>
                                            {post.content}
                                        </Typography>

                                        {post.images?.length > 0 && (
                                            <Box className={styles.imageContainer}>
                                                {post.images.map((img) => (
                                                    <img
                                                        key={img.uuid}
                                                        src={img.image_url}
                                                        alt="post"
                                                        className={styles.image}
                                                    />
                                                ))}
                                            </Box>
                                        )}

                                        <Box className={styles.boxButtons}>
                                            <Button onClick={() => handlePostInteract(post.uuid)} sx={{ color: isAlreadyLiked(post.liked_by) ? '' : 'gray' }}>
                                                <ThumbUpAltIcon />
                                                {post.liked_by.length}
                                            </Button>
                                            <Button>
                                                <ChatIcon />
                                            </Button>
                                            <Button>
                                                <SendIcon />
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </InfiniteScroll>
                </Box>
            )}
        </Box>
    );
}