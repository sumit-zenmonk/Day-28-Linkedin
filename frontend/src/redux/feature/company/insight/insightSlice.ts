"use client";

import { createSlice } from "@reduxjs/toolkit";
import { InsightState } from "./insightType";
import {
    getInsight,
    createInsight,
    updateInsight,
    deleteInsight,
} from "./insightAction";

const initialState: InsightState = {
    company: null,
    loading: false,
    error: null,
    status: "idle",
};

const insightSlice = createSlice({
    name: "insight",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getInsight.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getInsight.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload;
                state.status = "success";
            })
            .addCase(getInsight.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.status = "failed";
            })
            .addCase(createInsight.fulfilled, (state, action) => {
                state.company = action.payload;
            })
            .addCase(updateInsight.fulfilled, (state, action) => {
                state.company = action.payload;
            })
            .addCase(deleteInsight.fulfilled, (state) => {
                state.company = null;
            });
    },
});

export default insightSlice.reducer;