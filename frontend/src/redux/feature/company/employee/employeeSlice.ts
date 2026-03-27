"use client";

import { createSlice } from "@reduxjs/toolkit";
import { EmployeeState } from "./employeeType";
import { getCompanyEmployees } from "./employeeAction";

const initialState: EmployeeState = {
    jobs: [],
    totalDocuments: 0,
    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCompanyEmployees.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCompanyEmployees.fulfilled, (state, action) => {
                state.loading = false;

                if (action.meta.arg.page === 1) {
                    state.jobs = action.payload.jobs;
                } else {
                    const existingIds = new Set(
                        state.jobs.map((job) => job.uuid)
                    );

                    const newData = action.payload.jobs.filter(
                        (item) => !existingIds.has(item.uuid)
                    );

                    state.jobs = [...state.jobs, ...newData];
                }

                state.totalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getCompanyEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default employeeSlice.reducer;