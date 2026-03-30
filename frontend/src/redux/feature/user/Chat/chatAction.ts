import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getChatMessages = createAsyncThunk<
    any,
    { friendUuid: string; page?: number; limit?: number },
    { state: RootState }
>(
    "chat/getMessages",
    async (
        { friendUuid, page = 1, limit = 50 },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";
            const res = await fetch(`${API_URL}/chat/messages/${friendUuid}?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const sendMessage = createAsyncThunk<
    any,
    { receiver_uuid: string; content: string },
    { state: RootState }
>(
    "chat/sendMessage",
    async (
        { receiver_uuid, content },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";
            const res = await fetch(`${API_URL}/chat/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ receiver_uuid, content }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
