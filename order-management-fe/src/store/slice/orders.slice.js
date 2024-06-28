import { createSlice } from '@reduxjs/toolkit';
import { ORDER } from '../types';

const ordersSlice = createSlice({
    name: ORDER,
    reducers: {
        getActiveOrderRequest() {},
        getCompletedOrdersRequest() {},
        getActiveOrderSuccess(state, action) {
            state.activeOrder = action.payload;
        },
        getCompletedOrdersSuccess(state, action) {
            const { data, count } = action.payload;
            state.completedOrders = data;
            state.completedCount = count;
        },
        setSelectedOrder(state, action) {
            const data = action.payload;
            if (data) {
                state.selectedOrder = {
                    title: 'Order Details',
                    closeText: 'Close',
                    data: {
                        id: data.id,
                        menu: data.menu,
                        price: data.price,
                        sgst: data.sgst,
                        cgst: data.cgst,
                        totalPrice: data.totalPrice,
                        paymentId: data.paymentId
                    }
                };
            } else {
                state.selectedOrder = data;
            }
        },
        updatePendingOrderRequest() {}
    },
    initialState: {
        activeOrder: {},
        completedOrders: [],
        selectedOrder: false,
        completedCount: 0
    }
});
export const {
    getActiveOrderRequest,
    getActiveOrderSuccess,
    getCompletedOrdersRequest,
    getCompletedOrdersSuccess,
    setSelectedOrder,
    updatePendingOrderRequest
} = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;
