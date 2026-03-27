"use client";

import styles from "./job.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, TextField, Typography, Chip, } from "@mui/material";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { RootState } from "@/redux/store";
import { jobSchema, JobFormValues, } from "@/schemas/job.schema";
import { createJob, getJobs, deleteJob, } from "@/redux/feature/company/job/jobAction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { getInsight } from "@/redux/feature/company/insight/insightAction";

export default function JobPage() {
    const dispatch = useAppDispatch();
    const { jobs } = useAppSelector((state: RootState) => state.jobReducer);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<JobFormValues>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            position: "",
            location: "",
            role: "",
            min_salary: 0,
            max_salary: 0,
            tags: [],
        },
    });

    useEffect(() => {
        dispatch(getJobs());
    }, [dispatch]);

    const onSubmit = async (data: JobFormValues) => {
        try {
            await dispatch(createJob(data)).unwrap();
            await dispatch(getInsight()).unwrap();
            enqueueSnackbar("Job created", { variant: "success" });
            reset();
        } catch (err) {
            enqueueSnackbar(String(err), { variant: "error" });
        }
    };

    const handleDelete = async (uuid: string) => {
        try {
            await dispatch(deleteJob(uuid)).unwrap();
            await dispatch(getInsight()).unwrap();
            enqueueSnackbar("Job deleted", { variant: "success" });
        } catch (err) {
            enqueueSnackbar(String(err), { variant: "error" });
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.wrapper}>
                <Box className={styles.formSection}>
                    <Card className={styles.card}>
                        <Typography variant="h6">
                            Create Job
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label="Position"
                                fullWidth
                                {...register("position")}
                                error={!!errors.position}
                                helperText={errors.position?.message}
                                className={styles.field}
                            />

                            <TextField
                                label="Location"
                                fullWidth
                                {...register("location")}
                                error={!!errors.location}
                                helperText={errors.location?.message}
                                className={styles.field}
                            />

                            <TextField
                                label="Role"
                                fullWidth
                                {...register("role")}
                                error={!!errors.role}
                                helperText={errors.role?.message}
                                className={styles.field}
                            />

                            <TextField
                                label="Min Salary"
                                type="number"
                                fullWidth
                                {...register("min_salary", {
                                    valueAsNumber: true,
                                })}
                                error={!!errors.min_salary}
                                helperText={errors.min_salary?.message}
                                className={styles.field}
                            />

                            <TextField
                                label="Max Salary"
                                type="number"
                                fullWidth
                                {...register("max_salary", {
                                    valueAsNumber: true,
                                })}
                                error={!!errors.max_salary}
                                helperText={errors.max_salary?.message}
                                className={styles.field}
                            />

                            <TextField
                                label="Tags (comma separated)"
                                fullWidth
                                className={styles.field}
                                onChange={(e) =>
                                    setValue(
                                        "tags",
                                        e.target.value.split(",").map(t => t.trim())
                                    )
                                }
                            />

                            <Box className={styles.buttonGroup}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                >
                                    Create
                                </Button>
                            </Box>
                        </form>
                    </Card>
                </Box>

                <Box className={styles.listSection}>
                    <Box className={styles.jobList}>
                        {jobs.map((job) => (
                            <Card
                                key={job.uuid}
                                className={styles.jobItem}
                            >
                                <Typography variant="h6">
                                    {job.position}
                                </Typography>

                                <Typography>
                                    {job.role} • {job.location}
                                </Typography>

                                <Typography>
                                    ${job.min_salary} - ${job.max_salary}
                                </Typography>

                                <Box>
                                    {job.tags?.map((tag) => (
                                        <Chip
                                            key={tag.uuid}
                                            label={tag.tag}
                                            size="small"
                                            sx={{ marginRight: "1%" }}
                                        />
                                    ))}
                                </Box>

                                <Box className={styles.buttonGroup}>
                                    <Button
                                        color="error"
                                        onClick={() =>
                                            handleDelete(job.uuid)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}