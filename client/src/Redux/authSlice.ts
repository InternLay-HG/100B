import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userData: null,
        token: null
    },
    reducers: {
        login: (state, action) => {
            state.userData = action.payload.user;
            state.token = action.payload.accessToken;
        },
        logout: (state) => {
            state.userData = null;
            state.token = null;
        },
        setCredentials: (state, action) => {
            state.token = action.payload.accessToken
        }
    }
})


export const { login, logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;