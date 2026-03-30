import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, Message } from "./chattype";
import { getChatMessages, sendMessage } from "./chatAction";

const initialState: ChatState = {
    messages: [],
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        receiveMessage: (state, action: PayloadAction<Message>) => {
            const exists = state.messages.find(m => m.uuid === action.payload.uuid);
            if (!exists) {
                state.messages.push(action.payload);
            }
        },
        clearChat: (state) => {
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChatMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getChatMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload.messages;
            })
            .addCase(getChatMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            });
    },
});

export const { receiveMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
