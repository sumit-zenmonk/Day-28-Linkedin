"use client"

import { createSlice } from "@reduxjs/toolkit";
import { ProfileState } from "./profileType";
import {
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    uploadImage,
    updateProfileImage,
} from "./profileAction";

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null,
    status: "idle",
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(deleteProfile.fulfilled, (state) => {
                state.profile = null;
            })
            .addCase(updateProfileImage.fulfilled, (state, action) => {
                if (state.profile) {
                    state.profile.profile_img = action.payload;
                }
            });
    },
});

export default profileSlice.reducer;