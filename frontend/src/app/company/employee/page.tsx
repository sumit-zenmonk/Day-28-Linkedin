"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Avatar, CircularProgress, } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./employee.module.css";
import { RootState } from "@/redux/store";
import { getCompanyEmployees } from "@/redux/feature/company/employee/employeeAction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function EmployeeListing() {
    const dispatch = useAppDispatch();
    const { jobs, loading, totalDocuments } = useAppSelector((state: RootState) => state.employeeReducer);
    const [page, setPage] = useState(1);
    const employees = jobs.flatMap((job) => job.employees);

    useEffect(() => {
        if (!employees.length || employees.length < totalDocuments) {
            dispatch(getCompanyEmployees({ limit: LIMIT, page }));
        }
    }, [dispatch, page]);

    const fetchMoreData = () => {
        if (loading) return;

        if (employees.length < totalDocuments) {
            setPage((prev) => prev + 1);
        }
    };

    if (!loading && employees.length === 0) {
        return (
            <Box className={styles.container}>
                <Typography align="center">
                    No employees found
                </Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.container} id="scrollableDiv">
            <InfiniteScroll
                dataLength={employees.length}
                next={fetchMoreData}
                hasMore={employees.length < totalDocuments}
                loader={
                    <Box className={styles.loader}>
                        <CircularProgress />
                    </Box>
                }
                scrollableTarget="scrollableDiv"
            >
                <Box className={styles.list}>
                    {employees.map((emp) => (
                        <Card key={emp.uuid} className={styles.card}>
                            <CardContent className={styles.cardContent}>
                                <Avatar
                                    src={
                                        emp.user.profile?.profile_img
                                            ?.image_url
                                    }
                                    className={styles.avatar}
                                />

                                <Box className={styles.info}>
                                    <Typography className={styles.name}>
                                        {emp.user.name}
                                    </Typography>

                                    <Typography className={styles.email}>
                                        {emp.user.email}
                                    </Typography>

                                    <Typography className={styles.bio}>
                                        {emp.user.profile?.bio || "No bio"}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </InfiniteScroll>
        </Box>
    );
}