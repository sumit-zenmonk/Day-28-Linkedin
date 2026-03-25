"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Button, Avatar, Divider, } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./request.module.css";
import { RootState } from "@/redux/store";
import { getConnectionRequests, getReceivedConnectionRequests, deleteConnectionRequest, makeConnection, } from "@/redux/feature/Connection/connectionAction";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";

const LIMIT = 10;

export default function RequestPage() {
    const dispatch = useAppDispatch();
    const { connections, connectionRequests, receivedConnectionRequests, loading, } = useAppSelector((state: RootState) => state.connectionReducer);
    const [receivedPage, setReceivedPage] = useState(1);
    const [sentPage, setSentPage] = useState(1);
    const [hasMoreReceived, setHasMoreReceived] = useState(true);
    const [hasMoreSent, setHasMoreSent] = useState(true);

    useEffect(() => {
        dispatch(getReceivedConnectionRequests({ limit: LIMIT, page: receivedPage }))
            .unwrap()
            .then((res: any) => {
                if (!res?.connectionsRequests || res.connectionsRequests.length < LIMIT) {
                    setHasMoreReceived(false);
                }
            })
            .catch((err) =>
                enqueueSnackbar(String(err || "Error"), { variant: "error" })
            );
    }, [dispatch, receivedPage]);

    useEffect(() => {
        dispatch(getConnectionRequests({ limit: LIMIT, page: sentPage }))
            .unwrap()
            .then((res: any) => {
                if (!res?.connectionsRequests || res.connectionsRequests.length < LIMIT) {
                    setHasMoreSent(false);
                }
            })
            .catch((err) =>
                enqueueSnackbar(String(err || "Error"), { variant: "error" })
            );
    }, [dispatch, sentPage]);

    const fetchMoreReceived = () => {
        if (!loading && hasMoreReceived) {
            setReceivedPage((prev) => prev + 1);
        }
    };

    const fetchMoreSent = () => {
        if (!loading && hasMoreSent) {
            setSentPage((prev) => prev + 1);
        }
    };

    const handleDelete = async (uuid: string) => {
        try {
            await dispatch(deleteConnectionRequest({ uuid })).unwrap();
            enqueueSnackbar("Request deleted", { variant: "success" });
        } catch (err) {
            enqueueSnackbar(String(err || "Delete failed"), {
                variant: "error",
            });
        }
    };

    const handleApproveConnection = async (uuid: string) => {
        try {
            await dispatch(makeConnection({ request_uuid: uuid })).unwrap();
            enqueueSnackbar("Connection Established", { variant: "success" });
        } catch (err) {
            enqueueSnackbar(String(err || "Delete failed"), {
                variant: "error",
            });
        }
    };

    const getUserDetails = (uuid: string) =>
        connections.find((user) => user.uuid === uuid);

    return (
        <Box className={styles.container}>
            <Typography className={styles.heading}>
                Requests Received
            </Typography>

            {receivedConnectionRequests.length === 0 && !loading && (
                <Typography className={styles.emptyText}>
                    No requests received
                </Typography>
            )}

            <InfiniteScroll
                dataLength={receivedConnectionRequests.length}
                next={fetchMoreReceived}
                hasMore={hasMoreReceived}
                loader={
                    <Box className={styles.loader}>
                        <CircularProgress />
                    </Box>
                }
            >
                {receivedConnectionRequests.map((req) => {
                    const user = getUserDetails(req.user_uuid);

                    return (
                        <Card key={req.uuid} className={styles.card}>
                            <CardContent className={styles.cardContent}>
                                <Box className={styles.infoBox}>
                                    <Avatar
                                        src={user?.profile?.profile_img?.image_url}
                                        className={styles.avatar}
                                    />
                                    <Box>
                                        <Typography className={styles.text}>
                                            {user?.name || "Unknown User"}
                                        </Typography>
                                        <Typography className={styles.value}>
                                            {user?.email || req.user_uuid}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box className={styles.actionBox}>
                                    <Button variant="contained" onClick={() => handleApproveConnection(req.uuid)}>
                                        Accept
                                    </Button>
                                    <Button
                                        color="error"
                                        variant="outlined"
                                        onClick={() => handleDelete(req.uuid)}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </InfiniteScroll>

            <Divider className={styles.divider} />

            <Typography className={styles.heading}>
                Requests Sent
            </Typography>

            {connectionRequests.length === 0 && !loading && (
                <Typography className={styles.emptyText}>
                    No sent requests
                </Typography>
            )}

            <InfiniteScroll
                dataLength={connectionRequests.length}
                next={fetchMoreSent}
                hasMore={hasMoreSent}
                loader={
                    <Box className={styles.loader}>
                        <CircularProgress />
                    </Box>
                }
            >
                {connectionRequests.map((req) => {
                    const user = getUserDetails(req.connected_user_uuid);

                    return (
                        <Card key={req.uuid} className={styles.card}>
                            <CardContent className={styles.cardContent}>
                                <Box className={styles.infoBox}>
                                    <Avatar
                                        src={user?.profile?.profile_img?.image_url}
                                        className={styles.avatar}
                                    />
                                    <Box>
                                        <Typography className={styles.text}>
                                            {user?.name || "Unknown User"}
                                        </Typography>
                                        <Typography className={styles.value}>
                                            {user?.email || req.connected_user_uuid}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleDelete(req.uuid)}
                                >
                                    Cancel
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </InfiniteScroll>
        </Box>
    );
}