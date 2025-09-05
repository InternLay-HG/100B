import { createSlice } from "@reduxjs/toolkit";

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        selected: null 
    },
    reducers: {
        setSelected: (state, action) => {
            state.selected = action.payload
        },
        setRemove: (state) => {
            state.selected = null
        }
    }
})

export const { setSelected, setRemove } = contactSlice.actions;
export default contactSlice.reducer;