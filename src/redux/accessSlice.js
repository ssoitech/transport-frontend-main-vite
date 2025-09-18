// accessSlice.js
import { createSlice } from '@reduxjs/toolkit';

const accessSlice = createSlice({
    name: 'access',
    initialState: {
        accessDetails: [],
    },
    reducers: {
        setAccessDetails: (state, action) => {
            state.accessDetails = action.payload;
        },
        clearAccessDetails: (state) => {
            state.accessDetails = [];
        },
    },
});

export const { setAccessDetails, clearAccessDetails } = accessSlice.actions;
export default accessSlice.reducer;

