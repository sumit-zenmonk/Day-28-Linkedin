"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Avatar, CircularProgress, Button, } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./connection.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { getConnections, sendConnectionRequest } from "@/redux/feature/Connection/connectionAction";
import { enqueueSnackbar } from "notistack";

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function GlobalConnectionPage() {
    const dispatch = useAppDispatch();
    const { connections, loading, connectionsTotalDocuments, connectionRequests, network } = useAppSelector((state: RootState) => state.connectionReducer);
    const [page, setPage] = useState(1);

    const isAlreadyRequested = (uuid: string) => { return connectionRequests.some((req) => req.connected_user_uuid === uuid); };
    const isAlreadyConnected = (uuid: string) => { return network.some((req) => req.connected_user.uuid === uuid); };

    useEffect(() => {
        if (!connections.length || connections.length < connectionsTotalDocuments) {
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

        if (connections.length < connectionsTotalDocuments) {
            setPage((prev) => prev + 1);
        }
    };

    const handleMakeConnectionRequest = async (uuid: string) => {
        if (isAlreadyRequested(uuid) || isAlreadyConnected(uuid)) {
            enqueueSnackbar("Already in Active State", { variant: "info" });
            return;
        }

        try {
            await dispatch(sendConnectionRequest({ connected_user_uuid: uuid })).unwrap();
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), {
                variant: "error",
            });
        }
    };

    if (!loading && connections.length === 0) {
        return (
            <Box className={styles.container}>
                <Typography align="center">No users right now</Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.container} id="scrollableDiv">
            <InfiniteScroll
                dataLength={connections.length}
                next={fetchMoreData}
                hasMore={connections.length < connectionsTotalDocuments}
                loader={
                    <Box className={styles.loader}>
                        <CircularProgress />
                    </Box>
                }
                scrollableTarget="scrollableDiv"
            >
                <Box className={styles.infiniteScrollComp}>
                    {connections
                        .filter((conn) => !isAlreadyConnected(conn.uuid))
                        .map((conn) => (
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

                                    <Button
                                        disabled={isAlreadyRequested(conn.uuid) || isAlreadyConnected(conn.uuid)}
                                        onClick={() => handleMakeConnectionRequest(conn.uuid)}
                                    >
                                        {isAlreadyRequested(conn.uuid) ? "Requested" : "Connect"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                </Box>
            </InfiniteScroll>
        </Box>
    );
}