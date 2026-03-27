"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Application } from "./jobType";

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

export const getCompanyApplications = createAsyncThunk<
    { applications: Application[]; totalDocuments: number },
    { limit?: number; page?: number },
    { state: RootState }
>(
    "job/getCompanyApplications",
    async ({ limit = 10, page = 1 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/company/job/application?limit=${limit}&page=${page}`,
                {
                    headers: { Authorization: token },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return {
                applications: data.jobs,
                totalDocuments: data.totalDocuments,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const getJobApplications = createAsyncThunk<
    any,
    string,
    { state: RootState }
>("job/getJobApplications", async (uuid, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(
            `${API_URL}/company/job/application/${uuid}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const createEmployee = createAsyncThunk<
    { employee: any; application_uuid: string },
    { application_uuid: string },
    { state: RootState }
>(
    "job/createEmployee",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/company/employee`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return {
                employee: data.data,
                application_uuid: payload.application_uuid, // 👈 important
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteApplication = createAsyncThunk<
    string,
    string,
    { state: RootState }
>("job/deleteApplication", async (uuid, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(
            `${API_URL}/company/job/application/${uuid}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            }
        );

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message);
        }

        return uuid;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});