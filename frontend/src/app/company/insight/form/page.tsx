"use client";

import styles from "./form.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import {
    insightSchema,
    InsightFormValues,
} from "@/schemas/insight.schema";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { createInsight, getInsight, updateInsight } from "@/redux/feature/company/insight/insightAction";

export default function InsightForm() {
    const dispatch = useAppDispatch();
    const { company } = useAppSelector((state: RootState) => state.insightReducer);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InsightFormValues>({
        resolver: zodResolver(insightSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile_number: "",
            industry: "",
            description: "",
            location: "",
        },
    });

    useEffect(() => {
        const init = async () => {
            try {
                const res = await dispatch(getInsight()).unwrap();

                if (!res) {
                    await dispatch(createInsight({})).unwrap();
                }
            } catch {
                await dispatch(createInsight({})).unwrap();
            }
        };

        init();
    }, [dispatch]);

    useEffect(() => {
        if (company) {
            reset({
                name: company.name || "",
                email: company.email || "",
                mobile_number: company.mobile_number || "",
                industry: company.industry || "",
                description: company.description || "",
                location: company.location || "",
            });
        }
    }, [company, reset]);

    const onSubmit = async (data: InsightFormValues) => {
        try {
            if (company) {
                await dispatch(updateInsight(data)).unwrap();
                enqueueSnackbar("Company updated", { variant: "success" });
            } else {
                await dispatch(createInsight(data)).unwrap();
                enqueueSnackbar("Company created", { variant: "success" });
            }
        } catch (error) {
            enqueueSnackbar(String(error || "Error"), {
                variant: "error",
            });
        }
    };

    return (
        <Box className={styles.container}>
            <Card className={styles.card}>
                <Typography variant="h5">
                    Company Insight
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Company Name"
                        fullWidth
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        className={styles.field}
                    />

                    <TextField
                        label="Email"
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        className={styles.field}
                    />

                    <TextField
                        label="Mobile Number"
                        fullWidth
                        {...register("mobile_number")}
                        error={!!errors.mobile_number}
                        helperText={errors.mobile_number?.message}
                        className={styles.field}
                    />

                    <TextField
                        label="Industry"
                        fullWidth
                        {...register("industry")}
                        error={!!errors.industry}
                        helperText={errors.industry?.message}
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
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        {...register("description")}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        className={styles.field}
                    />

                    <Box className={styles.buttonGroup}>
                        <Button variant="contained" type="submit">
                            {company ? "Update" : "Create"}
                        </Button>
                    </Box>
                </form>
            </Card>
        </Box>
    );
}