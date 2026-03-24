"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

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