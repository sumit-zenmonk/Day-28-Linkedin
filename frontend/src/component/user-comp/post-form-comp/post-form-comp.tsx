"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/schemas/post.schema";
import { createPost, uploadPostImages } from "@/redux/feature/user/Post/postAction";
import { Card, TextField, Typography, Box, IconButton, Button, Modal, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon from "@mui/icons-material/Article";
import { enqueueSnackbar } from "notistack";
import styles from "./post.form.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";

const MAX_FILES = Number(process.env.NEXT_PUBLIC_BACKEND_IMG_LIMIT) || 5;

export default function PostFormPage() {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);
    const { profile, status } = useAppSelector((state: RootState) => state.profileReducer)
    const { user } = useAppSelector((state: RootState) => state.authReducer)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
    });

    const onSubmit = async (data: PostFormValues) => {
        try {
            let images: any[] = [];

            if (files.length > MAX_FILES) {
                enqueueSnackbar(`You can only upload up to ${MAX_FILES} images`, { variant: "warning" });
                return;
            }

            if (files.length > 0) {
                const uploaded = await dispatch(uploadPostImages(files)).unwrap();

                images = uploaded.map((img: any) => ({
                    image_url: img.path,
                }));
            }

            await dispatch(
                createPost({
                    content: data.content,
                    images,
                })
            ).unwrap();

            reset();
            setFiles([]);
            setOpen(false);
        } catch (error) {
            enqueueSnackbar("Error creating post", { variant: "error" });
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Box className={styles.container}>
            <Card className={styles.startCard}>
                <Box className={styles.startTop}>
                    <Avatar className={styles.avatar} src={profile?.profile_img?.image_url || ""} />
                    <Box className={styles.startInput} onClick={() => setOpen(true)}>
                        Start a post
                    </Box>
                </Box>

                <Box className={styles.actions}>
                    <Box className={styles.action} onClick={() => setOpen(true)}><VideoLibraryIcon /> Video</Box>
                    <Box className={styles.action} onClick={() => setOpen(true)}><ImageIcon /> Photo</Box>
                    <Box className={styles.action} onClick={() => setOpen(true)}><ArticleIcon /> Write article</Box>
                </Box>
            </Card>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box className={styles.modal}>
                    <Box className={styles.modalHeader}>
                        <Avatar className={styles.avatar} src={profile?.profile_img?.image_url || ""} />
                        <Typography>{user?.name}</Typography>
                    </Box>

                    <Box className={styles.modalHeader}>
                        <Box></Box>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <TextField
                            placeholder="What do you want to talk about?"
                            multiline
                            minRows={3}
                            maxRows={6}
                            fullWidth
                            {...register("content")}
                            error={!!errors.content}
                            helperText={errors.content?.message}
                        />

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                setFiles(Array.from(e.target.files || []))
                            }
                        />

                        <Box className={styles.fileList}>
                            {files.map((file, i) => (
                                <Box key={i} className={styles.fileItem}>
                                    <Typography className={styles.fileName}>
                                        {file.name}
                                    </Typography>
                                    <IconButton size="small" onClick={() => removeFile(i)}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        <Button type="submit" variant="contained">
                            Post
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}