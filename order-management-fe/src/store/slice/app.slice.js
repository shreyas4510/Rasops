import { createSlice } from '@reduxjs/toolkit';
import { LOADER } from '../types';

const appSlice = createSlice({
    name: LOADER,
    reducers: {
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },

        setNotification(state, action) {
            state.notification = action.payload;
        }
    },
    initialState: {
        isLoading: false,
        notification: false
    }
});

export const { setIsLoading, setNotification } = appSlice.actions;

export const appReducer = appSlice.reducer;
