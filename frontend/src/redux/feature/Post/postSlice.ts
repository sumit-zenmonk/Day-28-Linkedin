"use client";

import { createSlice } from "@reduxjs/toolkit";
import { PostState } from "./postType";
import { getPosts, createPost, deletePost } from "./postAction";

const initialState: PostState = {
    posts: [],
    loading: false,
    error: null,
    totalDocuments: 0,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.posts;
                state.totalDocuments = action.payload.totalDocuments;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(
                    (p) => p.uuid !== action.payload
                );
            });
    },
});

export default postSlice.reducer;