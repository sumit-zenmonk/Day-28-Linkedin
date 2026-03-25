"use client";

import { createSlice } from "@reduxjs/toolkit";
import { ConnectionState } from "./connectionType";
import { getConnections, sendConnectionRequest, getConnectionRequests, deleteConnectionRequest, getReceivedConnectionRequests, makeConnection, getNetworkConnections } from "./connectionAction";

const initialState: ConnectionState = {
    connections: [],
    connectionRequests: [],
    receivedConnectionRequests: [],
    network: [],
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
                    const existingIds = new Set(
                        state.connections.map((c) => c.uuid)
                    );

                    const newData = action.payload.connections.filter(
                        (item) => !existingIds.has(item.uuid)
                    );
                    state.connections = [...state.connections, ...newData];
                }
                state.totalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getConnections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                state.connectionRequests.unshift(action.payload);
                state.error = null;
                state.loading = false;
            })
            .addCase(getConnectionRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(getConnectionRequests.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.connectionRequests = action.payload.requests;
                } else {
                    const existingIds = new Set(
                        state.connectionRequests.map((r) => r.uuid)
                    );

                    const newData = action.payload.requests.filter(
                        (item) => !existingIds.has(item.uuid)
                    );

                    state.connectionRequests = [
                        ...state.connectionRequests,
                        ...newData,
                    ];
                }
                state.error = null;
            })
            .addCase(getConnectionRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteConnectionRequest.fulfilled, (state, action) => {
                state.connectionRequests = state.connectionRequests.filter(
                    (req) => req.uuid !== action.payload
                );
                state.error = null;
                state.loading = false;
            })
            .addCase(getReceivedConnectionRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(getReceivedConnectionRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.receivedConnectionRequests = action.payload.requests;
                state.error = null;
            })
            .addCase(getReceivedConnectionRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(makeConnection.pending, (state) => {
                state.loading = true;
            })
            .addCase(makeConnection.fulfilled, (state, action) => {
                state.loading = false;
                const acceptedConnection = action.payload;

                state.receivedConnectionRequests = state.receivedConnectionRequests.filter(
                    (req) => req.uuid !== action.meta.arg.request_uuid
                );
                state.connectionRequests = state.connectionRequests.filter(
                    (req) => req.uuid !== action.meta.arg.request_uuid
                );
                state.network.push(acceptedConnection);
                state.error = null;
            })
            .addCase(makeConnection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getNetworkConnections.pending, (state) => {
                state.loading = true;
            })
            .addCase(getNetworkConnections.fulfilled, (state, action) => {
                if (action.meta.arg.page === 1) {
                    state.network = action.payload.connections;
                } else {
                    const existingIds = new Set(state.network.map((c) => c.uuid));
                    const newData = action.payload.connections.filter((item) => !existingIds.has(item.uuid));
                    state.network = [...state.network, ...newData];
                }

                state.error = null;
                state.loading = false;
                state.totalDocuments = action.payload.totalDocuments;
            })
            .addCase(getNetworkConnections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default connectionSlice.reducer;