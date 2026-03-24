"use client";

import { createSlice } from "@reduxjs/toolkit";
import { ConnectionState } from "./connectionType";
import { getConnections } from "./connectionAction";

const initialState: ConnectionState = {
    connections: [],
    totalDocuments: 0,
    loading: false,
    error: null,
};

const connectionSlice = createSlice({
    name: "connection",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getConnections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getConnections.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.connections = action.payload.connections;
                } else {
                    const existingIds = new Set(state.connections.map(c => c.uuid));
                    const newData = action.payload.connections.filter(
                        (item) => !existingIds.has(item.uuid)
                    );
                    state.connections = [...state.connections, ...newData];
                }
                state.totalDocuments = action.payload.totalDocuments;
            })
            .addCase(getConnections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default connectionSlice.reducer;