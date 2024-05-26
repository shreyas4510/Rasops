import { createSlice } from '@reduxjs/toolkit';
import { LOADER } from '../types/loader';

const loaderSlice = createSlice({
    name: LOADER,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    initialState: {
        isLoading: false
    }
});

export const { setIsLoading } = loaderSlice.actions;

export const loaderReducer = loaderSlice.reducer;
