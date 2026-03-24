"use client"

import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getProfile = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
    "profile/get",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/profile`, {
                headers: {
                    Authorization: token,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data.profile;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const createProfile = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
    "profile/create",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/profile`, {
                method: "POST",
                headers: {
                    Authorization: token,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateProfile = createAsyncThunk<
    any,
    any,
    { state: RootState }
>(
    "profile/update",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteProfile = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
    "profile/delete",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            await fetch(`${API_URL}/profile`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            });

            return null;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const uploadImage = createAsyncThunk<
    string,
    File,
    { state: RootState }
>(
    "profile/uploadImage",
    async (file, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const formData = new FormData();
            formData.append("imageUrl", file);

            const res = await fetch(`${API_URL}/upload/image`, {
                method: "POST",
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data.image_urls[0].path;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateProfileImage = createAsyncThunk<
    any,
    string,
    { state: RootState }
>(
    "profile/updateImage",
    async (image_url, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/profile/img`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({ image_url }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);