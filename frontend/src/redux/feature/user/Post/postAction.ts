"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Post } from "./postType";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getPosts = createAsyncThunk<
    { posts: Post[]; totalDocuments: number },
    { page?: number; limit?: number },
    { state: RootState }
>(
    "post/getAll",
    async ({ page = 1, limit = 10 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token;

            const res = await fetch(
                `${API_URL}/user/post?page=${page}&limit=${limit}`,
                {
                    headers: { Authorization: token || "" },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return {
                posts: data.connectionsRequests || [],
                totalDocuments: data.totalDocuments || 0,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const createPost = createAsyncThunk(
    "post/create",
    async (payload: any, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).authReducer.token;

            const res = await fetch(`${API_URL}/user/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token || "",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    "post/delete",
    async (uuid: string, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).authReducer.token;

            await fetch(`${API_URL}/user/post/${uuid}`, {
                method: "DELETE",
                headers: { Authorization: token || "" },
            });

            return uuid;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);
export const uploadPostImages = createAsyncThunk(
    "post/uploadImages",
    async (files: File[], { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).authReducer.token;

            const formData = new FormData();

            files.forEach((file) => {
                formData.append("imageUrl", file);
            });

            const res = await fetch(`${API_URL}/upload/images`, {
                method: "POST",
                headers: {
                    Authorization: token || "",
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data.image_urls;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const interactWithPost = createAsyncThunk<
    any,
    { postUuid: string; content?: string },
    { state: RootState }
>(
    "post/interact",
    async ({ postUuid, content }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token;

            const res = await fetch(`${API_URL}/user/post/interaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token || "",
                },
                body: JSON.stringify({
                    post_uuid: postUuid,
                    content: content
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to interact with post");
            }

            return data.message;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);