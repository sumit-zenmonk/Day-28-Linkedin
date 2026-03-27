import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getJobs = createAsyncThunk<
    { jobs: any[]; totalDocuments: number },
    { limit?: number; page?: number, tag?: string },
    { state: RootState }
>("jobs/get", async ({ limit = 10, page = 1, tag = "" }, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(
            `${API_URL}/user/job/?limit=${limit}&page=${page}&${tag ? `tag=${tag}` : ""}`,
            {
                headers: { Authorization: token },
            }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return {
            jobs: data.jobs,
            totalDocuments: data.totalDocuments,
        };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const applyJob = createAsyncThunk<
    any,
    { job_uuid: string },
    { state: RootState }
>("jobs/apply", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/user/job/application`, {
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

export const getAppliedJobs = createAsyncThunk<
    { jobs: any[]; totalDocuments: number },
    void,
    { state: RootState }
>("jobs/applied", async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${API_URL}/user/job/application`, {
            headers: { Authorization: token },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return {
            jobs: data.jobs,
            totalDocuments: data.totalDocuments,
        };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const deleteApplication = createAsyncThunk<
    string,
    string,
    { state: RootState }
>("jobs/deleteApplication", async (uuid, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        await fetch(`${API_URL}/user/job/application/${uuid}`, {
            method: "DELETE",
            headers: {
                Authorization: token,
            },
        });

        return uuid;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});