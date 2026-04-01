"use client";

import { useEffect, useState } from "react";
import { getPosts, deletePost, interactWithPost } from "@/redux/feature/user/Post/postAction";
import styles from "./post.module.css";
import { Card, CardContent, Typography, Avatar, IconButton, CircularProgress, Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { getLinkedInTime } from "@/util/post.time";
import PublicIcon from '@mui/icons-material/Public';
import MoodEmojiReactionPanel from "@/component/user-comp/MoodEmojiReactionPanel";

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function PostList() {
    const dispatch = useAppDispatch();
    const { posts, loading, totalDocuments } = useAppSelector((state: RootState) => state.postReducer);
    const user = useAppSelector((state: RootState) => state.authReducer.user);
    const [page, setPage] = useState(1);
    const router = useRouter()
    const [hoveredPost, setHoveredPost] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getPosts({ page, limit: LIMIT }));
    }, [dispatch, page]);

    const fetchMoreData = () => {
        if (loading) return;

        if (posts.length < totalDocuments) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePostInteract = async (post_uuid: string, content?: string) => {
        try {
            const currentInteraction = posts.find(p => p.uuid === post_uuid)?.liked_by.find((his: any) => his.user_uuid === user?.uid);

            // If clicking the same emoji, remove it
            const finalContent = currentInteraction?.content === content ? undefined : content;

            const result = await dispatch(interactWithPost({ postUuid: post_uuid, content: finalContent })).unwrap();
            await dispatch(getPosts({ page, limit: LIMIT })).unwrap();
            enqueueSnackbar(result, { variant: "success" });
            setHoveredPost(null);
        } catch (err) {
            console.error(err);
        }
    };

    const isAlreadyLiked = (liked_byArray: any) => {
        return liked_byArray.find((his: any) => his.user_uuid === user?.uid);
    };

    const getReactionCounts = (liked_byArray: any) => {
        return liked_byArray.reduce((acc: any, curr: any) => {
            acc[curr.content] = (acc[curr.content] || 0) + 1;
            return acc;
        }, {});
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
                            {posts.map((post) => {
                                const userInteraction = isAlreadyLiked(post.liked_by);
                                return (
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
                                                            {getLinkedInTime(post.created_at)} &#9679; <PublicIcon />
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

                                            <Box className={styles.boxButtons} style={{ position: 'relative' }}>
                                                {hoveredPost === post.uuid && (
                                                    <Box
                                                        onMouseLeave={() => setHoveredPost(null)}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '100%',
                                                            left: 0,
                                                            zIndex: 10,
                                                            marginBottom: '8px'
                                                        }}
                                                    >
                                                        <MoodEmojiReactionPanel
                                                            onReaction={(emoji) => handlePostInteract(post.uuid, emoji)}
                                                            initialReactions={getReactionCounts(post.liked_by)}
                                                        />
                                                    </Box>
                                                )}
                                                <Button
                                                    onMouseEnter={() => setHoveredPost(post.uuid)}
                                                    onClick={() => handlePostInteract(post.uuid, userInteraction ? undefined : '👍')}
                                                    sx={{ color: userInteraction ? '#0a66c2' : 'gray', textTransform: 'none' }}
                                                >
                                                    {userInteraction ? (
                                                        <span style={{ marginRight: '4px' }}>{userInteraction.content}</span>
                                                    ) : (
                                                        <ThumbUpAltIcon sx={{ marginRight: '4px' }} />
                                                    )}
                                                    {post.liked_by.length > 0 && post.liked_by.length} Like
                                                </Button>
                                                <Button sx={{ color: 'gray', textTransform: 'none' }}>
                                                    <ChatIcon sx={{ marginRight: '4px' }} />
                                                    Comment
                                                </Button>
                                                <Button sx={{ color: 'gray', textTransform: 'none' }}>
                                                    <SendIcon sx={{ marginRight: '4px' }} />
                                                    Send
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </InfiniteScroll>
                </Box>
            )}
        </Box>
    );
}