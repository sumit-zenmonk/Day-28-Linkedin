"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/schemas/post.schema";
import { createPost, uploadPostImages } from "@/redux/feature/user/Post/postAction";
import { Button, Card, TextField, Typography, Box, IconButton } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "@/redux/hooks.ts";
import CloseIcon from '@mui/icons-material/Close';
import "./post.form.css"

const MAX_FILES = Number(process.env.NEXT_PUBLIC_BACKEND_IMG_LIMIT) || 5;

export default function PostFormPage() {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState<File[]>([]);

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
        } catch (error) {
            enqueueSnackbar("Error creating post", { variant: "error" });
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Card className="postFormCard">
            <Typography variant="h5" className="formTitle">Create Post</Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="postForm">
                <TextField
                    label="Content"
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={6}
                    {...register("content")}
                    error={!!errors.content}
                    helperText={errors.content?.message}
                    className="textField"
                />

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="fileInput"
                    onChange={(e) =>
                        setFiles(Array.from(e.target.files || []))
                    }
                    className="fileInput"
                />

                <Box className="fileList">
                    {files.map((file, i) => (
                        <Box key={i} className="fileItem">
                            <Typography noWrap className="fileName">{file.name}</Typography>
                            <IconButton size="small" onClick={() => removeFile(i)} aria-label="Remove file">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <Button type="submit" variant="contained" className="submitButton" fullWidth>
                    Post
                </Button>
            </form>
        </Card>
    );
}