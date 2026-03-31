"use client";

import { useEffect, useState } from "react";
import { getConnectionPosts } from "@/redux/feature/user/Connection/connectionAction";
import styles from "./post.module.css";
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    IconButton,
    CircularProgress,
    Box,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { interactWithPost } from "@/redux/feature/user/Post/postAction";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { getLinkedInTime } from "@/util/post.time";
import PublicIcon from '@mui/icons-material/Public';

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function ConnectionPostComp() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.authReducer.user);
    const { connectionPosts, loading, postsTotalDocuments } = useAppSelector((state: RootState) => state.connectionReducer);
    const [page, setPage] = useState(1);
    const router = useRouter()

    useEffect(() => {
        dispatch(getConnectionPosts({ limit: LIMIT, page }));
    }, [dispatch, page]);

    const fetchMoreData = () => {
        if (loading) return;

        if (connectionPosts.length < postsTotalDocuments) {
            setPage((prev) => prev + 1);
        }
    };

    if (!loading && connectionPosts.length === 0) {
        return <Box className={styles.loader}>No Post found</Box>;
    }

    const handlePostInteract = async (post_uuid: string) => {
        try {
            const result = await dispatch(interactWithPost(post_uuid)).unwrap();
            await dispatch(getConnectionPosts({ limit: LIMIT, page })).unwrap();
            enqueueSnackbar(result, { variant: "success" })
        }
        catch (err) {
            console.error(err);
        }
    }
    const isAlreadyLiked = (liked_byArray: any) => { return liked_byArray.some((his: any) => his.user_uuid === user?.uid); };
    console.log(connectionPosts[0].liked_by);
    return (
        <Box className={styles.container} id="scrollableDiv">
            <InfiniteScroll
                dataLength={connectionPosts.length}
                next={fetchMoreData}
                hasMore={connectionPosts.length < postsTotalDocuments}
                loader={
                    <Box className={styles.loader}>
                        <CircularProgress />
                    </Box>
                }
                scrollableTarget="scrollableDiv"
                className={styles.infiniteScroll}
            >
                <Box className={styles.flexWrap}>
                    {connectionPosts.map((post) => (
                        <Card key={post.uuid} className={styles.card}>
                            <CardContent className={styles.cardContent}>
                                <Box className={styles.header}>
                                    <Box className={styles.userInfo} onClick={() => { router.push(`/user/${post.user_uuid}`) }}>
                                        <Avatar
                                            src={post.user?.profile?.profile_img?.image_url || ""}
                                            className={styles.avatar}
                                        >
                                            {post.user.name[0]}
                                        </Avatar>

                                        <Box className={styles.profileinfo}>
                                            <Typography className={styles.username}>
                                                {post.user.name}
                                            </Typography>
                                            <Typography className={styles.bio}>
                                                {post.user?.profile?.bio}
                                            </Typography>
                                            <Typography className={styles.date}>
                                                {getLinkedInTime(post.created_at)} &#9679; <PublicIcon />
                                            </Typography>
                                        </Box>
                                    </Box>
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
                                                className={styles.image}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </CardContent>

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
                        </Card>
                    ))}
                </Box>
            </InfiniteScroll>
        </Box>
    );
}