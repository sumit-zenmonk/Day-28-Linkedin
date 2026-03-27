"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getJobs = createAsyncThunk<
    any,
    void,
    { state: RootState }
>("job/getAll", async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/company/job`, {
            headers: {
                Authorization: token,
            },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.data;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

 export const getJob = createAsyncThunk<
    any,
    string,
    { state: RootState }
>("job/getOne", async (uuid, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/company/job/${uuid}`, {
            headers: {
                Authorization: token,
            },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.data;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const createJob = createAsyncThunk<
    any,
    any,
    { state: RootState }
>("job/create", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/company/job`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.data;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const deleteJob = createAsyncThunk<
    string,
    string,
    { state: RootState }
>("job/delete", async (uuid, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/company/job/${uuid}`, {
            method: "DELETE",
            headers: {
                Authorization: token,
            },
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message);
        }

        return uuid;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});