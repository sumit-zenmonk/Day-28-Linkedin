"use client";

import styles from "./insight.module.css";
import { Box, Card, Typography, Button } from "@mui/material";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { deleteInsight } from "@/redux/feature/company/insight/insightAction";

export default function InsightDashboard() {
    const dispatch = useAppDispatch();
    const { company: insight, loading } = useAppSelector((state: RootState) => state.insightReducer);

    if (!insight) {
        return (
            <Box className={styles.empty}>
                <Typography>No data available</Typography>
            </Box>
        );
    }

    const handleDelete = () => {
        dispatch(deleteInsight());
    };

    const employees = insight.employees?.length || 0;
    const jobs = insight.jobs?.length || 0;

    return (
        <Box className={styles.container}>
            <Box className={styles.left}>
                <Card className={styles.card}>
                    <Typography variant="h6">Info</Typography>

                    <Box className={styles.row}>
                        <span>Name</span>
                        <span>{insight.name}</span>
                    </Box>

                    <Box className={styles.row}>
                        <span>Email</span>
                        <span>{insight.email}</span>
                    </Box>

                    <Box className={styles.row}>
                        <span>Phone</span>
                        <span>{insight.mobile_number}</span>
                    </Box>

                    <Box className={styles.row}>
                        <span>Industry</span>
                        <span>{insight.industry}</span>
                    </Box>

                    <Box className={styles.row}>
                        <span>Location</span>
                        <span>{insight.location}</span>
                    </Box>

                    <Typography>
                        {insight.description}
                    </Typography>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
                    </Button>
                </Card>
            </Box>

            <Box className={styles.right}>
                <Card className={styles.analytics}>
                    <Typography>Employees</Typography>
                    <Typography variant="h5">{employees}</Typography>
                </Card>

                <Card className={styles.analytics}>
                    <Typography>Jobs</Typography>
                    <Typography variant="h5">{jobs}</Typography>
                </Card>

                <Card className={styles.analytics}>
                    <Typography>Created</Typography>
                    <Typography>
                        {new Date(insight.created_at).toLocaleDateString()}
                    </Typography>
                </Card>

                <Card className={styles.analytics}>
                    <Typography>Updated</Typography>
                    <Typography>
                        {new Date(insight.updated_at).toLocaleDateString()}
                    </Typography>
                </Card>
            </Box>
        </Box>
    );
}