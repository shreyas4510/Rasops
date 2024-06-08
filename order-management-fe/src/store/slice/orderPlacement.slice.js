import { createSlice } from '@reduxjs/toolkit';
import { ORDER_PLACEMENT } from '../types/orderPlacement';

const orderPlacementSlice = createSlice({
    name: ORDER_PLACEMENT,
    reducers: {
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        getTableDetailsRequest() {},
        getTableDetailsSuccess(state, action) {
            state.tableDetails = action.payload;
        },
        registerCustomerRequest() {}
    },
    initialState: {
        currentPage: 0,
        tableDetails: {}
    }
});
export const { setCurrentPage, getTableDetailsRequest, getTableDetailsSuccess, registerCustomerRequest } = orderPlacementSlice.actions;

export const orderPlacementReducer = orderPlacementSlice.reducer;
