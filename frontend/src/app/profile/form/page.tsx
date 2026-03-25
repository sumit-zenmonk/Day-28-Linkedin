"use client";

import styles from "./profile.module.css";
import { updateProfile, uploadImage, updateProfileImage, createProfile, getProfile, } from "@/redux/feature/Profile/profileAction";
import { createEducation, getEducation, } from "@/redux/feature/Education/educationAction";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { RootState } from "@/redux/store";
import { profileSchema, ProfileFormValues, educationSchema, EducationFormValues, employmentSchema, EmploymentFormValues, } from "@/schemas/profile.schema";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { createEmployment, getEmployment } from "@/redux/feature/Employment/employmentAction";
import { enqueueSnackbar } from "notistack";


export default function ProfileForm() {
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
        }
    });

    useEffect(() => {
        dispatch(getProfile()).unwrap();
        if (!profile) {
            dispatch(createProfile()).unwrap();
        }
    }, [])

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
            console.error(error);
        }
    };

    const handleImageUpload = async () => {
        try {
            if (!file) return;
            const path = await dispatch(uploadImage(file)).unwrap();
            await dispatch(updateProfileImage(path)).unwrap();
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
            console.error(error)
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
            console.error(error)
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
                <Typography variant="h5">Edit Profile</Typography>

                {profile?.profile_img?.image_url && (
                    <img
                        src={profile.profile_img.image_url}
                        className={styles.imagePreview}
                    />
                )}

                <Button
                    variant="outlined"
                    component="label"
                >
                    Choose File
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </Button>

                {file && (
                    <Typography variant="body2" className={styles.field}>
                        Selected: {file.name}
                    </Typography>
                )}

                <Button onClick={handleImageUpload}>Upload Image</Button>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Bio"
                        fullWidth
                        {...register("bio")}
                        error={!!errors.bio}
                        helperText={errors.bio?.message}
                        className={styles.field}
                    />

                    <TextField
                        label="Mobile"
                        fullWidth
                        {...register("mobile_number")}
                        error={!!errors.mobile_number}
                        helperText={errors.mobile_number?.message}
                        className={styles.field}
                    />

                    <Button variant="contained" type="submit">
                        Save Profile
                    </Button>
                </form>
            </Card>

            <Card className={styles.card}>
                <Typography variant="h5">Add Education</Typography>

                <form onSubmit={handleEduSubmit(onEducationSubmit)}>
                    <TextField
                        label="School Name"
                        fullWidth
                        {...eduRegister("school_name")}
                        error={!!eduErrors.school_name}
                        helperText={eduErrors.school_name?.message}
                        className={styles.field}
                    />

                    <TextField
                        label="School URL"
                        fullWidth
                        {...eduRegister("school_url")}
                        className={styles.field}
                    />

                    <TextField
                        type="date"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        {...eduRegister("start_date")}
                        error={!!eduErrors.start_date}
                        helperText={eduErrors.start_date?.message}
                        className={styles.field}
                    />

                    <TextField
                        type="date"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        {...eduRegister("end_date")}
                        error={!!eduErrors.end_date}
                        helperText={eduErrors.end_date?.message}
                        className={styles.field}
                    />

                    <Button variant="contained" type="submit">
                        Save Education
                    </Button>
                </form>
            </Card>

            <Card className={styles.card}>
                <Typography variant="h5">Add Employment</Typography>

                <form onSubmit={handleEmpSubmit(onEmploymentSubmit)}>
                    <TextField
                        label="Company Name"
                        fullWidth
                        {...empRegister("company_name")}
                        error={!!empErrors.company_name}
                        helperText={empErrors.company_name?.message}
                        className={styles.field}
                    />

                    <TextField
                        label="Company URL"
                        fullWidth
                        {...empRegister("company_url")}
                        className={styles.field}
                    />

                    <TextField
                        type="date"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        {...empRegister("start_date")}
                        error={!!empErrors.start_date}
                        helperText={empErrors.start_date?.message}
                        className={styles.field}
                    />

                    <TextField
                        type="date"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        {...empRegister("end_date")}
                        error={!!empErrors.end_date}
                        helperText={empErrors.end_date?.message}
                        className={styles.field}
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        {...empRegister("description")}
                        className={styles.field}
                    />

                    <Button variant="contained" type="submit">
                        Save Employment
                    </Button>
                </form>
            </Card>
        </Box>
    );
}