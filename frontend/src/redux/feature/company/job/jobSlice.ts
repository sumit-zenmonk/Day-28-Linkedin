"use client";

import { createSlice } from "@reduxjs/toolkit";
import { JobState } from "./jobType";
import { getJobs, getJob, createJob, deleteJob } from "./jobAction";

const initialState: JobState = {
    jobs: [],
    job: null,
    loading: false,
    error: null,
    status: "idle",
};

const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getJobs.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
                state.status = "success";
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.status = "failed";
            })
            .addCase(getJob.fulfilled, (state, action) => {
                state.job = action.payload;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.jobs.unshift(action.payload);
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter(
                    (job) => job.uuid !== action.payload
                );
            });
    },
});

export default jobSlice.reducer;