import { createSlice } from "@reduxjs/toolkit";
import {
    getJobs,
    applyJob,
    getAppliedJobs,
    deleteApplication,
} from "./jobAction";
import { JobState } from "./jobType";

const initialState: JobState = {
    jobs: [],
    applications: [],
    totalDocuments: 0,
    loading: false,
    error: null,
};

const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getJobs.fulfilled, (state, action) => {
                state.jobs = action.payload.jobs;
                state.totalDocuments = action.payload.totalDocuments;
            })
            .addCase(applyJob.fulfilled, (state, action) => {
                state.applications.push(action.payload);
            })
            .addCase(getAppliedJobs.fulfilled, (state, action) => {
                state.applications = action.payload.jobs;
                state.totalDocuments = action.payload.totalDocuments;
            })
            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.applications = state.applications.filter(
                    (app) => app.uuid !== action.payload
                );
            });
    },
});

export default jobSlice.reducer;