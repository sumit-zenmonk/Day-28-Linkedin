"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { SignupSchemaType } from "@/schemas/signup"
import { persistor } from "@/redux/store"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export const signupUser = createAsyncThunk(
    "auth/signup",
    async (data: SignupSchemaType, { rejectWithValue }) => {
        try {
            const { confirmPassword, ...payload } = data

            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.message)

            return result
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.message)

            return result
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(error.message)
        }
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include"
            })

            await persistor.purge();
            return null
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const googleLogin = createAsyncThunk(
    "auth/google",
    async (_, { rejectWithValue }) => {
        try {
            const provider = new GoogleAuthProvider()
            const res = await signInWithPopup(auth, provider)
            const idToken = await res.user.getIdToken()
            const response = await fetch(`${API_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ idToken })
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.message)

            return result
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)