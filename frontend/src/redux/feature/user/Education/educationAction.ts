import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getEducation = createAsyncThunk<
    any,
    void,
    { state: RootState }
>("education/get", async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/user/profile/education`, {
            headers: { Authorization: token },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const createEducation = createAsyncThunk<
    any,
    any,
    { state: RootState }
>("education/create", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/user/profile/education`, {
            method: "POST",
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
});

export const updateEducation = createAsyncThunk<
    any,
    any,
    { state: RootState }
>("education/update", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/user/profile/education`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.education;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const deleteEducation = createAsyncThunk<
    string,
    string,
    { state: RootState }
>("education/delete", async (uuid, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        await fetch(`${API_URL}/user/profile/education`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ uuid }),
        });

        return uuid;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});