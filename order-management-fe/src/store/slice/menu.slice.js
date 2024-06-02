import { createSlice } from '@reduxjs/toolkit';
import { CATEGORY } from '../types/menu';

const menuSlice = createSlice({
    name: CATEGORY,
    initialState: {
        data: {},
        categoriesOptions: [],
        selectedCategory: {},
        categoryModalData: false
    },
    reducers: {
        getCategoryRequest() {},
        getCategorySucess(state, action) {
            const { rows } = action.payload;
            const categories = rows?.map((item) => ({ label: item.name, value: item.id }));
            state.data = action.payload;
            state.categoriesOptions = categories;
            state.selectedCategory = categories[0];
        },
        setcategoryModalData(state, action) {
            state.categoryModalData = action.payload;
        },
        createCategoryRequest() {},
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
        updateCategoryRequest() {},
        removeCategoryRequest() {}
    }
});

export const {
    getCategoryRequest,
    getCategorySucess,
    setcategoryModalData,
    createCategoryRequest,
    setSelectedCategory,
    updateCategoryRequest,
    removeCategoryRequest
} = menuSlice.actions;

export const menuReducer = menuSlice.reducer;
