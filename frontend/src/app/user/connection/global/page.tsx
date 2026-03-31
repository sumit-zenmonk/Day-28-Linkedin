"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Avatar, CircularProgress, Button, Modal, } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./connection.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { getConnections, sendConnectionRequest } from "@/redux/feature/user/Connection/connectionAction";
import { enqueueSnackbar } from "notistack";
import UserConnectionRequestPage from "@/component/user-comp/request-comp.tsx/request-comp";
import { useRouter } from "next/navigation";
import ShareIcon from '@mui/icons-material/Share';

const LIMIT = 50;

export default function GlobalConnectionPage() {
    const dispatch = useAppDispatch();
    const { connections, loading, connectionsTotalDocuments, connectionRequests, network } = useAppSelector((state: RootState) => state.connectionReducer);
    const [page, setPage] = useState(1);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const router = useRouter();

    const isAlreadyRequested = (uuid: string) => { return connectionRequests.some((req) => req.connected_user_uuid === uuid); };
    const isAlreadyConnected = (uuid: string) => { return network.some((req) => req.connected_user_uuid === uuid); };
    const handleProfileFormModalOpen = () => setOpenModal(true);
    const handleProfileFormModalClose = () => setOpenModal(false);

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
            <Box className={styles.topButton}>
                <Button variant="contained" onClick={handleProfileFormModalOpen}>
                    Requests
                </Button>
            </Box>

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
                                <Box className={styles.banner} />

                                <CardContent className={styles.cardContent}>
                                    <Avatar
                                        src={conn.profile?.profile_img?.image_url}
                                        className={styles.avatar}
                                        onClick={() => { router.push(`/user/${conn.uuid}`) }}
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

                                    {
                                        !isAlreadyConnected(conn.uuid) &&
                                        < Button
                                            disabled={isAlreadyRequested(conn.uuid) || isAlreadyConnected(conn.uuid)}
                                            onClick={() => handleMakeConnectionRequest(conn.uuid)}
                                            className={styles.connectbtn}
                                            startIcon={<ShareIcon />}
                                        >
                                            {isAlreadyRequested(conn.uuid) ? "Requested" : "Connect"}
                                        </Button>
                                    }
                                </CardContent>
                            </Card>
                        ))}
                </Box>
            </InfiniteScroll>
            <Modal
                open={openModal}
                onClose={handleProfileFormModalClose}
            >
                <UserConnectionRequestPage />
            </Modal>
        </Box>
    );
}