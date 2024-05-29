import { createSlice } from '@reduxjs/toolkit';
import { CATEGORY } from '../types/menu';

const menuSlice = createSlice({
    name: CATEGORY,
    initialState: {
        data: {}
    },
    reducers: {
        getCategoryRequest() {},
        getCategorySucess(state, action) {
            state.data = action.payload;
        }
    }
});

export const { getCategoryRequest, getCategorySucess } = menuSlice.actions;

export const authReducer = menuSlice.reducer;
