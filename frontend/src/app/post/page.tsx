"use client";

import { useEffect, useState } from "react";
import { getPosts, deletePost } from "@/redux/feature/Post/postAction";
import styles from "./post.module.css";
import { Card, CardContent, Typography, Avatar, IconButton, CircularProgress, Box, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function PostList() {
    const dispatch = useAppDispatch();
    const { posts, loading, totalDocuments } = useAppSelector((state: RootState) => state.postReducer);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(getPosts({ page, limit: LIMIT }));
    }, [dispatch, page]);

    const fetchMoreData = () => {
        if (loading) return;

        if (posts.length < totalDocuments) {
            setPage((prev) => prev + 1);
        }
    };

    if (!loading && posts?.length === 0) {
        return <Box className={styles.loader}>No Post found</Box>;
    }

    return (
        <Box className={styles.container} id="scrollableDiv">
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

                                {/* Header */}
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

                                    <IconButton
                                        onClick={() => dispatch(deletePost(post.uuid))}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                {/* Content */}
                                <Typography className={styles.content}>
                                    {post.content}
                                </Typography>

                                {/* Images */}
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
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </InfiniteScroll>
        </Box>
    );
}