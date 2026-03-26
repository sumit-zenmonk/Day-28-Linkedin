"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getInsight = createAsyncThunk<
    any,
    void,
    { state: RootState }
>("insight/get", async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/company/insight`, {
            headers: {
                Authorization: token,
            },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.company;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const createInsight = createAsyncThunk<
    any,
    any,
    { state: RootState }
>("insight/create", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/company/insight`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.company;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const updateInsight = createAsyncThunk<
    any,
    any,
    { state: RootState }
>("insight/update", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/company/insight`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.company;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const deleteInsight = createAsyncThunk<
    void,
    void,
    { state: RootState }
>("insight/delete", async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        await fetch(`${API_URL}/company/insight`, {
            method: "DELETE",
            headers: {
                Authorization: token,
            },
        });
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});