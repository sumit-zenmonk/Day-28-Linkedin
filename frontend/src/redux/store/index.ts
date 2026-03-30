"use client"

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../feature/Auth/authSlice";

//user Reducers
import profileReducer from "../feature/user/Profile/profileSlice";
import educationReducer from "../feature/user/Education/educationSlice";
import employmentReducer from "../feature/user/Employment/employmentSlice";
import connectionReducer from "../feature/user/Connection/connectionSlice";
import postReducer from "../feature/user/Post/postSlice";
import UserJobReducer from "../feature/user/job/jobSlice";
import chatReducer from "../feature/user/Chat/chatSlice";

// company Reducers
import insightReducer from "../feature/company/insight/insightSlice";
import jobReducer from "../feature/company/job/jobSlice";
import employeeReducer from "../feature/company/employee/employeeSlice";

const persistConfig = {
    key: "root",
    storage,
};

const appReducer = combineReducers({
    authReducer: authReducer,
    profileReducer: profileReducer,
    educationReducer: educationReducer,
    employmentReducer: employmentReducer,
    connectionReducer: connectionReducer,
    postReducer: postReducer,
    insightReducer: insightReducer,
    jobReducer: jobReducer,
    UserJobReducer: UserJobReducer,
    employeeReducer: employeeReducer,
    chatReducer: chatReducer
});

const rootReducer = (state: any, action: any) => {
    if (action.type.includes("auth/logout/fulfilled")) {
        // storage.removeItem("persist:root");
        state = undefined;
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;