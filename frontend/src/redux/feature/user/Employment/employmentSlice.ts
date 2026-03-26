import { createSlice } from "@reduxjs/toolkit";
import {
    getEmployment,
    createEmployment,
    updateEmployment,
    deleteEmployment,
} from "./employmentAction";
import { EmploymentState } from "./employmentType";

const initialState: EmploymentState = {
    employmentList: [],
    loading: false,
    error: null,
};

const employmentSlice = createSlice({
    name: "employment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEmployment.fulfilled, (state, action) => {
                state.employmentList = action.payload;
            })
            .addCase(createEmployment.fulfilled, (state, action) => {
                state.employmentList.push(action.payload);
            })
            .addCase(updateEmployment.fulfilled, (state, action) => {
                const index = state.employmentList.findIndex(
                    (e: any) => e.uuid === action.payload.uuid
                );
                if (index !== -1) {
                    state.employmentList[index] = action.payload;
                }
            })
            .addCase(deleteEmployment.fulfilled, (state, action) => {
                state.employmentList = state.employmentList.filter(
                    (e: any) => e.uuid !== action.payload
                );
            });
    },
});

export default employmentSlice.reducer;