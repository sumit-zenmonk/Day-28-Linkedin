"use client";

import { useEffect } from "react";
import { getProfile } from "@/redux/feature/Profile/profileAction";
import { getEducation, deleteEducation, } from "@/redux/feature/Education/educationAction";
import styles from "./profile.module.css";
import { Box, Card, Typography, Button } from "@mui/material";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { deleteEmployment, getEmployment } from "@/redux/feature/Employment/employmentAction";
import { enqueueSnackbar } from "notistack";

export default function ProfileView() {
    const dispatch = useAppDispatch();
    const { profile } = useAppSelector((state: RootState) => state.profileReducer);
    const { user } = useAppSelector((state: RootState) => state.authReducer);
    const { educationList } = useAppSelector((state: RootState) => state.educationReducer);
    const { employmentList } = useAppSelector((state: RootState) => state.employmentReducer);

    useEffect(() => {
        try {
            dispatch(getProfile()).unwrap();
            dispatch(getEducation()).unwrap();
            dispatch(getEmployment()).unwrap();
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
            console.error(error)
        }
    }, [dispatch]);

    const formatDate = (date?: string) => {
        if (!date) return "Present";
        return new Date(date).toLocaleDateString();
    };

    if (!profile) return <div>No profile found</div>;

    return (
        <Box className={styles.container}>
            <Card className={styles.card}>
                {profile.profile_img?.image_url && (
                    <img
                        src={profile.profile_img.image_url}
                        className={styles.imagePreview}
                    />
                )}

                <Typography variant="h6">Name:</Typography>
                <Typography>{user?.name}</Typography>

                <Typography variant="h6">Email:</Typography>
                <Typography>{user?.email}</Typography>

                <Typography variant="h6">Bio:</Typography>
                <Typography>{profile.bio}</Typography>

                <Typography variant="h6">Mobile:</Typography>
                <Typography>{profile.mobile_number}</Typography>
            </Card>

            <Card className={styles.card}>
                <Typography variant="h5">Education</Typography>

                {educationList?.length === 0 ? (
                    <Typography>No education added</Typography>
                ) : (
                    educationList.map((edu: any) => (
                        <Box key={edu.uuid} className={styles.field}>
                            <Typography variant="h6">
                                {edu.school_name}
                            </Typography>

                            {edu.specialization && (
                                <Typography>
                                    {edu.specialization}
                                </Typography>
                            )}

                            <Typography>
                                {formatDate(edu.start_date)} -{" "}
                                {formatDate(edu.end_date)}
                            </Typography>

                            {edu.description && (
                                <Typography>
                                    {edu.description}
                                </Typography>
                            )}

                            <Button
                                color="error"
                                size="small"
                                onClick={() =>
                                    dispatch(deleteEducation(edu.uuid))
                                }
                            >
                                Delete
                            </Button>
                        </Box>
                    ))
                )}
            </Card>

            <Card className={styles.card}>
                <Typography variant="h5">Employment</Typography>

                {employmentList?.length === 0 ? (
                    <Typography>No employment added</Typography>
                ) : (
                    employmentList.map((emp: any) => (
                        <Box key={emp.uuid} className={styles.field}>
                            <Typography variant="h6">
                                {emp.company_name}
                            </Typography>

                            {emp.company_url && (
                                <Typography color="primary">
                                    {emp.company_url}
                                </Typography>
                            )}

                            <Typography>
                                {formatDate(emp.start_date)} -{" "}
                                {formatDate(emp.end_date)}
                            </Typography>

                            {emp.description && (
                                <Typography>
                                    {emp.description}
                                </Typography>
                            )}

                            <Button
                                color="error"
                                size="small"
                                onClick={() =>
                                    dispatch(deleteEmployment(emp.uuid))
                                }
                            >
                                Delete
                            </Button>
                        </Box>
                    ))
                )}
            </Card>
        </Box>
    );
}