"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/schemas/post.schema";
import { createPost, uploadPostImages } from "@/redux/feature/Post/postAction";
import { Button, Card, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "@/redux/hooks.ts";

const MAX_FILES = Number(process.env.NEXT_PUBLIC_BACKEND_IMG_LIMIT) || 5;

export default function PostPage() {
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

    return (
        <Card style={{ padding: 20 }}>
            <Typography variant="h5">Create Post</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Content"
                    fullWidth
                    {...register("content")}
                    error={!!errors.content}
                    helperText={errors.content?.message}
                    style={{ marginBottom: 16 }}
                />

                <input
                    type="file"
                    multiple
                    onChange={(e) =>
                        setFiles(Array.from(e.target.files || []))
                    }
                />

                {files.map((file, i) => (
                    <Typography key={i}>{file.name}</Typography>
                ))}

                <Button type="submit" variant="contained">
                    Post
                </Button>
            </form>
        </Card>
    );
}