import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// GET
export const getEmployment = createAsyncThunk<
    any,
    void,
    { state: RootState }
>("employment/get", async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/profile/employment`, {
            headers: { Authorization: token },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

// CREATE
export const createEmployment = createAsyncThunk<
    any,
    any,
    { state: RootState }
>("employment/create", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/profile/employment`, {
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

// UPDATE
export const updateEmployment = createAsyncThunk<
    any,
    any,
    { state: RootState }
>("employment/update", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/profile/employment`, {
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
});

// DELETE
export const deleteEmployment = createAsyncThunk<
    string,
    string,
    { state: RootState }
>("employment/delete", async (uuid, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        await fetch(`${API_URL}/profile/employment`, {
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