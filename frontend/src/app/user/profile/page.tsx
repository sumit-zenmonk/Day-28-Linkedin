"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/redux/feature/user/Profile/profileAction";
import { getEducation, deleteEducation, } from "@/redux/feature/user/Education/educationAction";
import styles from "./profile.module.css";
import { Box, Card, Typography, Button, Modal } from "@mui/material";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { deleteEmployment, getEmployment, } from "@/redux/feature/user/Employment/employmentAction";
import { enqueueSnackbar } from "notistack";
import UserProfileFormComp from "@/component/user-comp/profile-form-comp/user-profile-form";
import { useRouter } from "next/navigation";

export default function ProfileView() {
    const dispatch = useAppDispatch();
    const { profile } = useAppSelector((state: RootState) => state.profileReducer);
    const { user } = useAppSelector((state: RootState) => state.authReducer);
    const { educationList } = useAppSelector((state: RootState) => state.educationReducer);
    const { employmentList } = useAppSelector((state: RootState) => state.employmentReducer);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        try {
            dispatch(getProfile()).unwrap();
            dispatch(getEducation()).unwrap();
            dispatch(getEmployment()).unwrap();
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), {
                variant: "error",
            });
            console.error(error);
        }
    }, [dispatch]);

    const formatDate = (date?: string) => {
        if (!date) return "Present";
        return new Date(date).toLocaleDateString();
    };

    const handleRedirect = (url: string) => {
        router.push(url);
    };

    const handleProfileFormModalOpen = () => setOpenModal(true);
    const handleProfileFormModalClose = () => setOpenModal(false);

    return (
        <Box className={styles.container}>
            <Box className={styles.scrollContainer}>
                <Box className={styles.topButton}>
                    <Button variant="contained" onClick={handleProfileFormModalOpen}>
                        Update Profile
                    </Button>
                </Box>

                {profile && (
                    <Box>
                        <Card className={styles.card}>
                            <Box className={styles.profileHeader}>
                                {profile.profile_img?.image_url && (
                                    <img
                                        src={profile.profile_img.image_url}
                                        className={styles.imagePreview}
                                    />
                                )}

                                <Box className={styles.profileInfo}>
                                    <Typography variant="h6">{user?.name}</Typography>
                                    <Typography className={styles.subText}>
                                        {user?.email}
                                    </Typography>
                                    <Typography className={styles.description}>
                                        {profile.bio}
                                    </Typography>
                                    <Typography className={styles.subText}>
                                        {profile.mobile_number}
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>

                        <Card className={styles.card}>
                            <Typography className={styles.sectionTitle}>
                                Education History
                            </Typography>

                            {educationList?.length === 0 ? (
                                <Typography>No education added</Typography>
                            ) : (
                                educationList.map((edu: any) => (
                                    <Box key={edu.uuid} className={styles.field}>
                                        <Typography className={styles.title}>
                                            {edu.school_name}
                                        </Typography>

                                        {edu.specialization && (
                                            <Typography className={styles.subText}>
                                                {edu.specialization}
                                            </Typography>
                                        )}

                                        <Typography className={styles.date}>
                                            {formatDate(edu.start_date)} -{" "}
                                            {formatDate(edu.end_date)}
                                        </Typography>

                                        {edu.description && (
                                            <Typography
                                                className={styles.description}
                                            >
                                                {edu.description}
                                            </Typography>
                                        )}

                                        <Box className={styles.actionRow}>
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
                                    </Box>
                                ))
                            )}
                        </Card>

                        <Card className={styles.card}>
                            <Typography className={styles.sectionTitle}>
                                Employment History
                            </Typography>

                            {employmentList?.length === 0 ? (
                                <Typography>No employment added</Typography>
                            ) : (
                                employmentList.map((emp: any) => (
                                    <Box key={emp.uuid} className={styles.field}>
                                        <Typography className={styles.title}>
                                            {emp.company_name}
                                        </Typography>

                                        {emp.company_url && (
                                            <Typography
                                                onClick={() =>
                                                    handleRedirect(emp.company_url)
                                                }
                                                className={styles.company_url}
                                            >
                                                {emp.company_url}
                                            </Typography>
                                        )}

                                        <Typography className={styles.date}>
                                            {formatDate(emp.start_date)} -{" "}
                                            {formatDate(emp.end_date)}
                                        </Typography>

                                        {emp.description && (
                                            <Typography
                                                className={styles.description}
                                            >
                                                {emp.description}
                                            </Typography>
                                        )}

                                        <Box className={styles.actionRow}>
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
                                    </Box>
                                ))
                            )}
                        </Card>
                    </Box>)}
            </Box>

            <Modal open={openModal} onClose={handleProfileFormModalClose}>
                <UserProfileFormComp />
            </Modal>
        </Box>
    );
}