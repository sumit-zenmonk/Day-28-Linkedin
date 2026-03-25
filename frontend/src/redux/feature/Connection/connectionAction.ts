"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { NetworkConnection } from "./connectionType";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getConnections = createAsyncThunk<
    { connections: any[]; totalDocuments: number },
    { limit?: number; page?: number },
    { state: RootState }
>(
    "connection/getAll",
    async ({ limit = 10, page = 1 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/connection/global?limit=${limit}&page=${page}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return {
                connections: data.connections,
                totalDocuments: data.totalDocuments,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const sendConnectionRequest = createAsyncThunk<
    any,
    { connected_user_uuid: string },
    { state: RootState }
>(
    "connection/sendRequest",
    async (body, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/connection/request`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const getConnectionRequests = createAsyncThunk<
    { requests: any[]; totalDocuments: number },
    { limit?: number; page?: number },
    { state: RootState }
>(
    "connection/getRequests",
    async ({ limit = 10, page = 1 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/connection/request?limit=${limit}&page=${page}`,
                {
                    headers: { Authorization: token },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return {
                requests: data.connectionsRequests,
                totalDocuments: data.totalDocuments,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteConnectionRequest = createAsyncThunk<
    string,
    { uuid: string },
    { state: RootState }
>(
    "connection/deleteRequest",
    async (body, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/connection/request`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return body.uuid;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const getReceivedConnectionRequests = createAsyncThunk<
    { requests: any[]; totalDocuments: number },
    { limit?: number; page?: number },
    { state: RootState }
>(
    "connection/getReceivedRequests",
    async ({ limit = 10, page = 1 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/connection/request/invite?limit=${limit}&page=${page}`,
                {
                    headers: { Authorization: token },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return {
                requests: data.connectionsRequests,
                totalDocuments: data.totalDocuments,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const makeConnection = createAsyncThunk<
    NetworkConnection,
    { request_uuid: string },
    { state: RootState }
>(
    "connection/makeConnection",
    async (body, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/connection`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return data.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const getNetworkConnections = createAsyncThunk<
    { connections: NetworkConnection[]; totalDocuments: number },
    { limit?: number; page?: number },
    { state: RootState }
>(
    "connection/getNetwork",
    async ({ limit = 10, page = 1 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/connection?limit=${limit}&page=${page}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return {
                connections: data.connections,
                totalDocuments: data.totalDocuments,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);