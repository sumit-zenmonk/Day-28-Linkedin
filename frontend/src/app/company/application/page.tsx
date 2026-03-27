"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Button, } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./application.module.css";
import { createEmployee, deleteApplication, getCompanyApplications } from "@/redux/feature/company/job/jobAction";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { getInsight } from "@/redux/feature/company/insight/insightAction";
import { getCompanyEmployees } from "@/redux/feature/company/employee/employeeAction";

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function ApplicationsPage() {
    const dispatch = useAppDispatch();
    const { applications, totalApplications, applicationsLoading, } = useAppSelector((state: RootState) => state.jobReducer);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(getCompanyApplications({ page, limit: LIMIT }));
    }, [dispatch, page]);

    const fetchMoreData = () => {
        if (applicationsLoading) return;

        if (applications.length < totalApplications) {
            setPage((prev) => prev + 1);
        }
    };

    const handleMakeEmployee = async (application_uuid: string) => {
        try {
            await dispatch(createEmployee({ application_uuid: application_uuid })).unwrap();
            await dispatch(getInsight()).unwrap();
            await dispatch(getCompanyEmployees({}));
        }
        catch (err: any) {
            console.log(err);
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const handleDeleteApplication = async (uuid: string) => {
        try {
            await dispatch(deleteApplication(uuid)).unwrap();
            enqueueSnackbar("Application deleted successfully", {
                variant: "success",
            });
        } catch (err: any) {
            enqueueSnackbar(err || "Failed to delete application", {
                variant: "error",
            });
        }
    };

    return (
        <Box className={styles.container} id="scrollableDiv">
            <Typography className={styles.title}>
                Applications
            </Typography>

            {applications.length ? (
                <InfiniteScroll
                    dataLength={applications.length}
                    next={fetchMoreData}
                    hasMore={applications.length < totalApplications}
                    loader={
                        <Box className={styles.loader}>
                            <CircularProgress />
                        </Box>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    <Box className={styles.list}>
                        {applications.map((app) => (
                            <Card key={app.uuid} className={styles.card}>
                                <CardContent className={styles.cardContent}>

                                    <Box className={styles.left}>
                                        <Typography className={styles.position}>
                                            {app.job.position}
                                        </Typography>

                                        <Typography className={styles.company}>
                                            {app.job.company?.name}
                                        </Typography>

                                        <Typography className={styles.location}>
                                            📍 {app.job.location}
                                        </Typography>

                                        <Typography className={styles.salary}>
                                            💰 ₹{app.job.min_salary} - ₹{app.job.max_salary}
                                        </Typography>

                                        <Box className={styles.tags}>
                                            {app.job.tags?.slice(0, 4).map((tag) => (
                                                <span key={tag.uuid} className={styles.tag}>
                                                    #{tag.tag}
                                                </span>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box className={styles.right}>
                                        <Typography className={styles.userName}>
                                            {app.user.name}
                                        </Typography>

                                        <Typography className={styles.userEmail}>
                                            {app.user.email}
                                        </Typography>

                                        <Typography className={styles.date}>
                                            {new Date(app.created_at).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <Box mt={2} display="flex" gap={1}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleMakeEmployee(app.uuid)}
                                    >
                                        Make Employee
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteApplication(app.uuid)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </InfiniteScroll>
            ) : (
                <Box className={styles.empty}>
                    <Typography>No applications found</Typography>
                </Box>
            )}
        </Box>
    );
}