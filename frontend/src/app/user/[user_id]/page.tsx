"use client";

import { useEffect } from "react";
import { Box, Typography, Avatar, Card, CardContent, CircularProgress, } from "@mui/material";
import styles from "./user.module.css";
import { RootState } from "@/redux/store";
import { getConnections } from "@/redux/feature/user/Connection/connectionAction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { useParams, useRouter } from "next/navigation";

const LIMIT = Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10;

export default function UserProfilePage() {
    const dispatch = useAppDispatch();
    const params = useParams()
    const { connections, loading } = useAppSelector((state: RootState) => state.connectionReducer);
    const loggedInuser = useAppSelector((state: RootState) => state.authReducer.user);
    const router = useRouter();

    const user = connections.find((u) => u.uuid === params.user_id);

    useEffect(() => {
        if (!user) {
            dispatch(getConnections({ limit: LIMIT, page: 1 }));
        }
    }, [dispatch, user]);

    if (loading && !user) {
        return (
            <Box className={styles.loader}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        if (params.user_id == loggedInuser?.uid) {
            router.replace('/user/profile');
        }
        return (
            <Box className={styles.container}>
                <Typography>User not found</Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.container}>
            <Card className={styles.headerCard}>
                <CardContent className={styles.headerContent}>
                    <Avatar
                        src={user.profile?.profile_img?.image_url}
                        className={styles.avatar}
                    />

                    <Box className={styles.headerInfo}>
                        <Typography className={styles.name}>{user.name}</Typography>
                        <Typography className={styles.email}>{user.email}</Typography>
                        <Typography className={styles.bio}>
                            {user.profile?.bio || "No bio available"}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Box className={styles.mainSection}>
                <Box className={styles.leftSection}>
                    <Card className={styles.card}>
                        <CardContent>
                            <Typography className={styles.sectionTitle}>
                                Experience
                            </Typography>

                            {user.employment_histories?.length === 0 ? (
                                <Typography>No experience added</Typography>
                            ) : (
                                user.employment_histories?.map((job) => (
                                    <Box key={job.uuid} className={styles.item}>
                                        <Typography className={styles.itemTitle}>
                                            {job.company_name}
                                        </Typography>
                                        <Typography className={styles.itemSub}>
                                            {job.start_date} - {job.end_date}
                                        </Typography>
                                        <Typography>{job.description}</Typography>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className={styles.card}>
                        <CardContent>
                            <Typography className={styles.sectionTitle}>
                                Education
                            </Typography>

                            {user.education_histories?.length === 0 ? (
                                <Typography>No education added</Typography>
                            ) : (
                                user.education_histories?.map((edu) => (
                                    <Box key={edu.uuid} className={styles.item}>
                                        <Typography className={styles.itemTitle}>
                                            {edu.school_name}
                                        </Typography>
                                        <Typography>{edu.specialization}</Typography>
                                        <Typography>{edu.description}</Typography>
                                        <Typography className={styles.itemSub}>
                                            {edu.start_date} - {edu.end_date}
                                        </Typography>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Box>

                <Box className={styles.rightSection}>
                    <Card className={styles.card}>
                        <CardContent>
                            <Typography className={styles.sectionTitle}>
                                Info
                            </Typography>
                            <Typography>Role: {user.role}</Typography>
                            <Typography>
                                Phone: {user.profile?.mobile_number || "N/A"}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}