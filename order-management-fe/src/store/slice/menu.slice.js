import { createSlice } from '@reduxjs/toolkit';
import { CATEGORY } from '../types';

const menuSlice = createSlice({
    name: CATEGORY,
    initialState: {
        categories: {},
        menuItems: {},
        categoriesOptions: [],
        selectedCategory: {},
        modalData: false,
        sorting: [],
        filtering: {},
        pagination: {
            pageIndex: 0,
            pageSize: 10
        },
        removeCheck: false
    },
    reducers: {
        getCategoryRequest() {},
        getCategorySucess(state, action) {
            const { rows } = action.payload;
            const categories = rows?.map((item) => ({ label: item.name, value: item.id }));
            state.categories = action.payload;
            state.categoriesOptions = categories;
            state.selectedCategory = categories[0] || {};
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
        createMenuItemRequest() {},
        removeMenuItemRequest() {},
        updateMenuItemsRequest() {},
        setSorting(state, action) {
            state.sorting = action.payload;
        },
        setFiltering(state, action) {
            state.filtering = action.payload;
        },
        setPagination(state, action) {
            state.pagination = action.payload;
        },
        setRemoveCheck(state, action) {
            state.removeCheck = action.payload;
        }
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
    createMenuItemRequest,
    removeMenuItemRequest,
    updateMenuItemsRequest,
    setSorting,
    setFiltering,
    setPagination,
    setRemoveCheck
} = menuSlice.actions;

export const menuReducer = menuSlice.reducer;
