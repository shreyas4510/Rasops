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
        updatePendingOrderRequest() {},
        setOrderSelectedTable(state, action) {
            state.selectedTable = action.payload;
        },
        setOrderSorting(state, action) {
            state.sorting = action.payload;
        },
        setOrderFiltering(state, action) {
            state.filtering = action.payload;
        },
        setOrderPagination(state, action) {
            state.pagination = action.payload;
        }
    },
    initialState: {
        activeOrder: {},
        completedOrders: [],
        selectedOrder: false,
        completedCount: 0,
        selectedTable: '',
        sorting: [],
        filtering: {},
        pagination: {
            pageIndex: 0,
            pageSize: 10
        }
    }
});
export const {
    getActiveOrderRequest,
    getActiveOrderSuccess,
    getCompletedOrdersRequest,
    getCompletedOrdersSuccess,
    setSelectedOrder,
    updatePendingOrderRequest,
    setOrderSelectedTable,
    setOrderSorting,
    setOrderFiltering,
    setOrderPagination
} = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;
