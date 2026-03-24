"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    CircularProgress,
    Button,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./connection.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { getConnections } from "@/redux/feature/Connection/connectionAction";
import { enqueueSnackbar } from "notistack";

const LIMIT = 10;

export default function ConnectionList() {
    const dispatch = useAppDispatch();
    const { connections, loading, totalDocuments } = useAppSelector((state: RootState) => state.connectionReducer);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!connections.length || connections.length < totalDocuments) {
            try {
                dispatch(getConnections({ limit: LIMIT, page })).unwrap();
            } catch (error) {
                enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
                console.error(error)
            }
        }
    }, [dispatch, page]);

    const fetchMoreData = () => {
        if (loading) return;

        if (connections.length < totalDocuments) {
            setPage((prev) => prev + 1);
        }
    };

    const handleMakeConnectionRequest = (uuid: string) => {
        enqueueSnackbar(uuid, { variant: "info" });
    }

    return (
        <Box className={styles.container} id="scrollableDiv">
            <InfiniteScroll
                dataLength={connections.length}
                next={fetchMoreData}
                hasMore={connections.length < totalDocuments}
                loader={
                    <Box className={styles.loader}>
                        <CircularProgress />
                    </Box>
                }
                scrollableTarget="scrollableDiv"
                className={styles.infiniteScrollComp}
            >
                {connections.map((conn) => (
                    <Card key={conn.uuid} className={styles.card}>
                        <CardContent className={styles.cardContent}>
                            <Avatar
                                src={conn.profile?.profile_img?.image_url}
                                className={styles.avatar}
                            />

                            <Box className={styles.infoBox}>
                                <Typography className={styles.name}>
                                    {conn.name}
                                </Typography>

                                <Typography className={styles.email}>
                                    {conn.email}
                                </Typography>

                                <Typography className={styles.bio}>
                                    {conn.profile?.bio}
                                </Typography>
                            </Box>

                            <Button onClick={() => { handleMakeConnectionRequest(conn.uuid) }}>
                                Connect
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </InfiniteScroll>
        </Box>
    );
}