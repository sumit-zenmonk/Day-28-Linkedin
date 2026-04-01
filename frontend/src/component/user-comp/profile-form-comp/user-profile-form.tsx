"use client";

import styles from "./profile.module.css";
import {
    updateProfile,
    uploadImage,
    updateProfileImage,
    createProfile,
    getProfile,
} from "@/redux/feature/user/Profile/profileAction";
import {
    createEducation,
    getEducation,
} from "@/redux/feature/user/Education/educationAction";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { RootState } from "@/redux/store";
import {
    profileSchema,
    ProfileFormValues,
    educationSchema,
    EducationFormValues,
    employmentSchema,
    EmploymentFormValues,
} from "@/schemas/profile.schema";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import {
    createEmployment,
    getEmployment,
} from "@/redux/feature/user/Employment/employmentAction";
import { enqueueSnackbar } from "notistack";

export default function UserProfileFormComp() {
    const dispatch = useAppDispatch();
    const { profile } = useAppSelector((state: RootState) => state.profileReducer);
    const { user } = useAppSelector((state: RootState) => state.authReducer);
    const [file, setFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            bio: profile?.bio,
            mobile_number: profile?.mobile_number,
        },
    });

    useEffect(() => {
        dispatch(getProfile()).unwrap();
        if (!profile) {
            dispatch(createProfile()).unwrap();
        }
    }, []);

    useEffect(() => {
        if (profile) {
            reset({
                bio: profile.bio || "",
                mobile_number: profile.mobile_number || "",
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await dispatch(
                updateProfile({
                    user_uuid: user?.uid,
                    bio: data.bio,
                    mobile_number: data.mobile_number,
                })
            ).unwrap();
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
        }
    };

    const handleImageUpload = async () => {
        try {
            if (!file) return;
            const path = await dispatch(uploadImage(file)).unwrap();
            await dispatch(updateProfileImage(path)).unwrap();
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
        }
    };

    const {
        register: eduRegister,
        handleSubmit: handleEduSubmit,
        reset: resetEdu,
        formState: { errors: eduErrors },
    } = useForm<EducationFormValues>({
        resolver: zodResolver(educationSchema),
    });

    const onEducationSubmit = async (data: EducationFormValues) => {
        try {
            const formattedData = {
                ...data,
                start_date: new Date(data.start_date).toISOString(),
                end_date: data.end_date
                    ? new Date(data.end_date).toISOString()
                    : undefined,
            };

            await dispatch(createEducation(formattedData)).unwrap();
            resetEdu();
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
        }
    };

    const {
        register: empRegister,
        handleSubmit: handleEmpSubmit,
        reset: resetEmp,
        formState: { errors: empErrors },
    } = useForm<EmploymentFormValues>({
        resolver: zodResolver(employmentSchema),
    });

    const onEmploymentSubmit = async (data: EmploymentFormValues) => {
        const formattedData = {
            ...data,
            start_date: new Date(data.start_date).toISOString(),
            end_date: data.end_date
                ? new Date(data.end_date).toISOString()
                : undefined,
        };

        await dispatch(createEmployment(formattedData));
        resetEmp();
    };

    useEffect(() => {
        dispatch(getEducation()).unwrap();
        dispatch(getEmployment()).unwrap();
    }, [dispatch]);

    return (
        <Box className={styles.container}>
            <Card className={styles.card}>
                <Typography className={styles.title}>Edit Profile</Typography>

                <Box className={styles.imageSection}>
                    {profile?.profile_img?.image_url && (
                        <img
                            src={profile.profile_img.image_url}
                            className={styles.imagePreview}
                        />
                    )}

                    <Box className={styles.uploadControls}>
                        <Button component="label" className={styles.outlineBtn}>
                            Choose
                            <input
                                type="file"
                                hidden
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                            />
                        </Button>

                        <Button
                            onClick={handleImageUpload}
                            className={styles.primaryBtn}
                        >
                            Upload
                        </Button>
                    </Box>
                </Box>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.form}
                >
                    <TextField
                        label="Bio"
                        fullWidth
                        {...register("bio")}
                        error={!!errors.bio}
                        helperText={errors.bio?.message}
                    />

                    <TextField
                        label="Mobile"
                        fullWidth
                        {...register("mobile_number")}
                        error={!!errors.mobile_number}
                        helperText={errors.mobile_number?.message}
                    />

                    <Button type="submit" className={styles.primaryBtn}>
                        Save Profile
                    </Button>
                </form>
            </Card>

            <Card className={styles.card}>
                <Typography className={styles.title}>Education</Typography>

                <form
                    onSubmit={handleEduSubmit(onEducationSubmit)}
                    className={styles.form}
                >
                    <TextField label="School Name" fullWidth {...eduRegister("school_name")} />
                    <TextField label="Specialization" fullWidth {...eduRegister("specialization")} />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        {...empRegister("description")}
                    />
                    <TextField label="School URL" fullWidth {...eduRegister("school_url")} />

                    <Box className={styles.row}>
                        <TextField type="date" fullWidth {...eduRegister("start_date")} />
                        <TextField type="date" fullWidth {...eduRegister("end_date")} />
                    </Box>

                    <Button type="submit" className={styles.primaryBtn}>
                        Add Education
                    </Button>
                </form>
            </Card>

            <Card className={styles.card}>
                <Typography className={styles.title}>Experience</Typography>

                <form
                    onSubmit={handleEmpSubmit(onEmploymentSubmit)}
                    className={styles.form}
                >
                    <TextField label="Company Name" fullWidth {...empRegister("company_name")} />
                    <TextField label="Company URL" fullWidth {...empRegister("company_url")} />

                    <Box className={styles.row}>
                        <TextField type="date" fullWidth {...empRegister("start_date")} />
                        <TextField type="date" fullWidth {...empRegister("end_date")} />
                    </Box>

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        {...empRegister("description")}
                    />

                    <Button type="submit" className={styles.primaryBtn}>
                        Add Experience
                    </Button>
                </form>
            </Card>
        </Box>
    );
}