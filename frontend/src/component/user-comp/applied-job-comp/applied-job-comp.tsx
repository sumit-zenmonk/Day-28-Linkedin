"use client";

import { useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    CircularProgress,
    Button,
} from "@mui/material";
import styles from "./job.module.css";
import { RootState } from "@/redux/store";
import {
    getAppliedJobs,
    deleteApplication,
} from "@/redux/feature/user/job/jobAction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";

export default function UserAppliedJobComp() {
    const dispatch = useAppDispatch();
    const { applications, totalApplicationDocuments, loading } = useAppSelector(
        (state: RootState) => state.UserJobReducer
    );

    useEffect(() => { 
        if (!applications.length || applications.length < totalApplicationDocuments) {
            dispatch(getAppliedJobs());
        }
    }, [dispatch, applications.length, totalApplicationDocuments]);

    const handleDelete = (uuid: string) => {
        dispatch(deleteApplication(uuid));
    };

    if (loading) {
        return (
            <Box className={styles.container} textAlign="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className={styles.container}>
            {applications.length ? (
                <Box className={styles.list}>
                    {applications.map((app) => (
                        <Card key={app.uuid} className={styles.card}>
                            <CardContent className={styles.cardContent}>
                                <Box className={styles.info}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {app.job.position}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {app.job.company.name}
                                        </Typography>

                                        <Typography variant="body2">
                                            📍 {app.job.location}
                                        </Typography>

                                        <Typography variant="body2">
                                            💼 {app.job.role}
                                        </Typography>

                                        <Typography variant="body2">
                                            💰 {app.job.min_salary} -{" "}
                                            {app.job.max_salary}
                                        </Typography>
                                    </Box>

                                    {
                                        app?.job?.tags?.length &&
                                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                            {
                                                app.job.tags
                                                    .filter((tag) => tag.tag)
                                                    .map((tag) => (
                                                        <Chip
                                                            key={tag.uuid}
                                                            label={tag.tag}
                                                            size="small"
                                                        />
                                                    ))
                                            }
                                        </Box>
                                    }

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                        mt={1}
                                    >
                                        Applied on:{" "}
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </Typography>

                                </Box>

                                {app?.job?.deleted_at && (
                                    <Box>
                                        <Chip
                                            label="Job Closed By company"
                                            color="error"
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                )}

                                {!app?.job?.deleted_at && (
                                    <Box mt={2}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                handleDelete(app.uuid)
                                            }
                                        >
                                            Remove Application
                                        </Button>
                                    </Box>
                                )}  
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Box textAlign="center">
                    <Typography>No Applied Jobs Available</Typography>
                </Box>
            )}
        </Box>
    );
}