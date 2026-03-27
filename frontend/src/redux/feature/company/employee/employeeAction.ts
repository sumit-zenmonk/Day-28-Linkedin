"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { CompanyJob } from "./employeeType";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getCompanyEmployees = createAsyncThunk<
    { jobs: CompanyJob[]; totalDocuments: number },
    { limit?: number; page?: number },
    { state: RootState }
>(
    "employee/getCompanyEmployees",
    async ({ limit = 10, page = 1 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/company/employee?limit=${limit}&page=${page}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return {
                jobs: data.jobs,
                totalDocuments: data.totalDocuments,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);