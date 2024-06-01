import { createSlice } from '@reduxjs/toolkit';
import { CATEGORY } from '../types/menu';

const menuSlice = createSlice({
    name: CATEGORY,
    initialState: {
        data: {},
        selectedCategory: {},
        addCategoryModalData: false
    },
    reducers: {
        getCategoryRequest() {},
        getCategorySucess(state, action) {
            state.data = action.payload;
        },
        setAddCategoryModalData(state, action) {
            state.addCategoryModalData = action.payload;
        },
        createCategoryRequest() {}
    }
});

export const { getCategoryRequest, getCategorySucess, setAddCategoryModalData, createCategoryRequest } =
    menuSlice.actions;

export const menuReducer = menuSlice.reducer;
