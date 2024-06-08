import { createSlice } from '@reduxjs/toolkit';
import { ORDER_PLACEMENT } from '../types/orderPlacement';

const orderPlacementSlice = createSlice({
    name: ORDER_PLACEMENT,
    reducers: {
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        getTableDetailsRequest() { },
        getTableDetailsSuccess(state, action) {
            state.tableDetails = action.payload;
        },
        registerCustomerRequest() { },
        getMenuDetailsRequest() { },
        getMenuDetailsSuccess(state, action) {
            state.menuCard = action.payload;
        }
    },
    initialState: {
        currentPage: 0,
        tableDetails: {},
        menuCard: {}
    }
});
export const { setCurrentPage, getTableDetailsRequest, getTableDetailsSuccess, registerCustomerRequest, getMenuDetailsRequest, getMenuDetailsSuccess } =
    orderPlacementSlice.actions;

export const orderPlacementReducer = orderPlacementSlice.reducer;
