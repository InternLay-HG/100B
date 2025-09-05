import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        instance: null,
        onlineUsers: []
    },
    reducers: {
        setSocket: (state, action) => {
            state.instance = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        }
    }
});

export const { setSocket, setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;