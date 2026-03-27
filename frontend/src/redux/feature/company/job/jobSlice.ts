"use client";

import { createSlice } from "@reduxjs/toolkit";
import { JobState } from "./jobType";
import { getJobs, getJob, createJob, deleteJob, getCompanyApplications, getJobApplications, createEmployee, deleteApplication } from "./jobAction";

const initialState: JobState = {
    jobs: [],
    job: null,
    applications: [],
    applicationsLoading: false,
    applicationsError: null,
    totalApplications: 0,
    employees: [],
    employeeLoading: false,
    employeeError: null,
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
            })
            .addCase(getCompanyApplications.pending, (state) => {
                state.applicationsLoading = true;
            })
            .addCase(getCompanyApplications.fulfilled, (state, action) => {
                state.applicationsLoading = false;
                state.applications = action.payload.applications;
                state.totalApplications = action.payload.totalDocuments;
            })
            .addCase(getCompanyApplications.rejected, (state, action) => {
                state.applicationsLoading = false;
                state.applicationsError = action.payload as string;
            })
            .addCase(getJobApplications.pending, (state) => {
                state.applicationsLoading = true;
            })
            .addCase(getJobApplications.fulfilled, (state, action) => {
                state.applicationsLoading = false;
                state.applications = action.payload.jobs;
                state.totalApplications = action.payload.totalDocuments;
            })
            .addCase(getJobApplications.rejected, (state, action) => {
                state.applicationsLoading = false;
                state.applicationsError = action.payload as string;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.employeeLoading = false;
                state.employees.unshift(action.payload.employee);
                state.applications = state.applications.filter(
                    (app) => app.uuid !== action.payload.application_uuid
                );
                state.totalApplications -= 1;
            })
            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.applications = state.applications.filter(
                    (app) => app.uuid !== action.payload
                );
                state.totalApplications -= 1;
            })
            .addCase(deleteApplication.pending, (state) => {
                state.applicationsLoading = true;
            })
            .addCase(deleteApplication.rejected, (state, action) => {
                state.applicationsLoading = false;
                state.applicationsError = action.payload as string;
            })
    },
});

export default jobSlice.reducer;