import { createSlice } from '@reduxjs/toolkit';
import { CATEGORY } from '../types/menu';

const menuSlice = createSlice({
    name: CATEGORY,
    initialState: {
        categories: {},
        menuItems: {},
        categoriesOptions: [],
        selectedCategory: {},
        modalData: false
    },
    reducers: {
        getCategoryRequest() {},
        getCategorySucess(state, action) {
            const { rows } = action.payload;
            const categories = rows?.map((item) => ({ label: item.name, value: item.id }));
            state.categories = action.payload;
            state.categoriesOptions = categories;
            state.selectedCategory = categories[0];
        },
        setMenuModalData(state, action) {
            state.modalData = action.payload;
        },
        createCategoryRequest() {},
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
        updateCategoryRequest() {},
        removeCategoryRequest() {},
        getMenuItemsRequest() {},
        getMenuItemsSuccess(state, action) {
            state.menuItems = action.payload;
        },
        createMenuItemRequest() {}
    }
});

export const {
    getCategoryRequest,
    getCategorySucess,
    setMenuModalData,
    createCategoryRequest,
    setSelectedCategory,
    updateCategoryRequest,
    removeCategoryRequest,
    getMenuItemsRequest,
    getMenuItemsSuccess,
    createMenuItemRequest
} = menuSlice.actions;

export const menuReducer = menuSlice.reducer;
