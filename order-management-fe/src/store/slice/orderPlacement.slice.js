import { createSlice } from '@reduxjs/toolkit';
import { ORDER_STATUS } from '../../utils/constants';
import { ORDER_PLACEMENT } from '../types';

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
        registerCustomerRequest() {},
        getMenuDetailsRequest() {},
        getMenuDetailsSuccess(state, action) {
            state.menuCard = action.payload;
        },
        setOrderDetails(state, action) {
            state.orderDetails = action.payload;
        },
        placeOrderRequest() {},
        getOrderDetailsRequest() {},
        setViewOrderDetails(state, action) {
            const { count, rows } = action.payload;
            state.viewOrderDetails = {
                count,
                title: 'View Order',
                data: rows,
                submitText: !rows?.find((obj) => obj.status === ORDER_STATUS[0]) ? 'Pay' : 'Update',
                closeText: !rows?.find((obj) => obj.status === ORDER_STATUS[0]) ? 'Pay Manually' : 'Close',
                updated: {},
                totalPrice: rows?.reduce((cur, next) => {
                    cur += next.price;
                    return cur;
                }, 0)
            };
        },
        setUpdatedOrderDetails(state, action) {
            state.viewOrderDetails.updated = action.payload;
        },
        payOrderRequest() {},
        setOrderPaymentData(state, action) {
            state.orderPaymentData = action.payload;
        },
        paymentConfirmationRequest() {},
        setFeedback(state, action) {
            state.feedback = action.payload;
        },
        sendFeedbackRequest() {},
        setFeedbackDetails(state, action) {
            state.feedbackDetails = action.payload;
        }
    },
    initialState: {
        currentPage: 0,
        tableDetails: {},
        menuCard: {},
        orderDetails: {},
        viewOrderDetails: {},
        orderPaymentData: false,
        feedback: false,
        feedbackDetails: {}
    }
});
export const {
    setCurrentPage,
    getTableDetailsRequest,
    getTableDetailsSuccess,
    registerCustomerRequest,
    getMenuDetailsRequest,
    getMenuDetailsSuccess,
    setOrderDetails,
    placeOrderRequest,
    setViewOrderDetails,
    getOrderDetailsRequest,
    setUpdatedOrderDetails,
    payOrderRequest,
    setOrderPaymentData,
    paymentConfirmationRequest,
    setFeedback,
    sendFeedbackRequest,
    setFeedbackDetails
} = orderPlacementSlice.actions;

export const orderPlacementReducer = orderPlacementSlice.reducer;
