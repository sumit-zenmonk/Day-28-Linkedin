"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Avatar, } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./network.module.css";
import { RootState } from "@/redux/store";
import { getNetworkConnections } from "@/redux/feature/user/Connection/connectionAction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function NetworkPage() {
  const dispatch = useAppDispatch();
  const { network, loading, networkTotalDocuments } = useAppSelector((state: RootState) => state.connectionReducer);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!network.length || network.length < networkTotalDocuments) {
      dispatch(getNetworkConnections({ limit: LIMIT, page })).unwrap();
    }
  }, [dispatch, page]);

  const fetchMoreData = () => {
    if (loading) return;

    if (network.length < networkTotalDocuments) {
      setPage((prev) => prev + 1);
    }
  };

  if (!loading && network.length === 0) {
    return (
      <Box className={styles.container}>
        <Typography align="center">
          No connections yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container} id="scrollableDiv">
      <InfiniteScroll
        dataLength={network.length}
        next={fetchMoreData}
        hasMore={network.length < networkTotalDocuments}
        loader={
          <Box className={styles.loader}>
            <CircularProgress />
          </Box>
        }
        scrollableTarget="scrollableDiv"
      >
        <Box className={styles.grid}>
          {network.map((conn) => {
            const user = conn.connected_user;

            return (
              <Card key={conn.uuid} className={styles.card}>
                <CardContent className={styles.cardContent}>
                  <Avatar
                    src={user?.profile?.profile_img?.image_url}
                    className={styles.avatar}
                  />

                  <Box className={styles.infoBox}>
                    <Typography className={styles.name}>
                      {user?.name || "Unknown User"}
                    </Typography>

                    <Typography className={styles.email}>
                      {user?.email || "No Email"}
                    </Typography>

                    <Typography className={styles.bio}>
                      {user?.profile?.bio || "No bio available"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </InfiniteScroll>
    </Box>
  );
}