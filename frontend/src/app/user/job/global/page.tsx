"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, CircularProgress, } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./job.global.module.css";
import { RootState } from "@/redux/store";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { applyJob, getJobs } from "@/redux/feature/user/job/jobAction";
import SearchComp from "@/component/search-comp/search_comp";

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function GlobalJobPage() {
    const dispatch = useAppDispatch();
    const { jobs, applications, totalJobDocuments, loading } = useAppSelector((state: RootState) => state.UserJobReducer);
    const [page, setPage] = useState(1);

    const isAlreadyApplied = (job_uuid: string) => {
        return applications.some((app) => app.job_uuid === job_uuid);
    };

    useEffect(() => {
        if (!jobs.length || jobs.length < totalJobDocuments) {
            dispatch(getJobs({ limit: LIMIT, page }));
        }
    }, [dispatch, page]);

    const fetchMoreData = () => {
        if (loading) return;

        if (jobs.length < totalJobDocuments) {
            setPage((prev) => prev + 1);
        }
    };

    const handleApply = async (job_uuid: string) => {
        if (isAlreadyApplied(job_uuid)) {
            enqueueSnackbar("Already Applied", { variant: "info" });
            return;
        }

        try {
            await dispatch(applyJob({ job_uuid })).unwrap();
        } catch (err) {
            enqueueSnackbar(String(err || "Something went wrong"), {
                variant: "error",
            });
        }
    };

    return (
        <Box className={styles.container} id="scrollableDiv">
            <SearchComp onSearch={(value) => {
                dispatch(getJobs({ tag: value }));
            }} />

            {(!loading && jobs.length) ?
                <InfiniteScroll
                    dataLength={jobs.length}
                    next={fetchMoreData}
                    hasMore={jobs.length < totalJobDocuments}
                    loader={
                        <Box className={styles.loader}>
                            <CircularProgress />
                        </Box>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    <Box className={styles.list}>
                        {jobs.map((job) => (
                            <Card key={job.uuid} className={styles.card}>
                                <CardContent className={styles.cardContent}>
                                    <Box className={styles.info}>
                                        <Typography className={styles.position}>
                                            {job.position}
                                        </Typography>

                                        <Typography className={styles.company}>
                                            {job.company?.name}
                                        </Typography>

                                        <Typography className={styles.location}>
                                            📍 {job.location}
                                        </Typography>

                                        <Typography className={styles.salary}>
                                            💰 ₹{job.min_salary} - ₹{job.max_salary}
                                        </Typography>

                                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                            {job.tags
                                                ?.filter((tag) => tag.tag)
                                                .slice(0, 5)
                                                .map((tag) => (
                                                    <span key={tag.uuid} className={styles.tag}>
                                                        #{tag.tag}
                                                    </span>
                                                ))}
                                        </Box>
                                        <Box
                                            mt={2}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Typography variant="caption" color="text.secondary">
                                                {job.role}
                                            </Typography>

                                            <Button
                                                variant={isAlreadyApplied(job.uuid) ? "outlined" : "contained"}
                                                color={isAlreadyApplied(job.uuid) ? "success" : "primary"}
                                                size="small"
                                                disabled={isAlreadyApplied(job.uuid)}
                                                onClick={() => handleApply(job.uuid)}
                                            >
                                                {isAlreadyApplied(job.uuid) ? "Applied" : "Apply"}
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </InfiniteScroll>
                :
                <Box className={styles.container}>
                    <Typography align="center">No jobs available</Typography>
                </Box>
            }
        </Box>
    );
}