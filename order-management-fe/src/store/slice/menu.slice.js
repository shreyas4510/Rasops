import { createSlice } from '@reduxjs/toolkit';
import { CATEGORY } from '../types/menu';

const menuSlice = createSlice({
    name: CATEGORY,
    initialState: {
        data: {},
        selectedCategory: {},
        menuModalData: false
    },
    reducers: {
        getCategoryRequest() {},
        getCategorySucess(state, action) {
            state.data = action.payload;
        },
        setMenuModalData(state, action) {
            state.menuModalData = action.payload;
        }
    }
});

export const { getCategoryRequest, getCategorySucess, setMenuModalData } = menuSlice.actions;

export const menuReducer = menuSlice.reducer;
