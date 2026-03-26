import { createSlice } from "@reduxjs/toolkit";
import {
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation,
} from "./educationAction";
import { EducationState } from "./educationTypes";

const initialState: EducationState = {
    educationList: [],
    loading: false,
    error: null,
};

const educationSlice = createSlice({
    name: "education",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEducation.fulfilled, (state, action) => {
                state.educationList = action.payload;
            })
            .addCase(createEducation.fulfilled, (state, action) => {
                state.educationList.push(action.payload);
            })
            .addCase(updateEducation.fulfilled, (state, action) => {
                const index = state.educationList.findIndex(
                    (e: any) => e.uuid === action.payload.uuid
                );
                if (index !== -1) {
                    state.educationList[index] = action.payload;
                }
            })
            .addCase(deleteEducation.fulfilled, (state, action) => {
                state.educationList = state.educationList.filter(
                    (e: any) => e.uuid !== action.payload
                );
            });
    },
});

export default educationSlice.reducer;