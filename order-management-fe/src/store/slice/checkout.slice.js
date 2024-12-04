import { createSlice } from '@reduxjs/toolkit';
import { CHECKOUT } from '../types';

const checkoutSlice = createSlice({
    name: CHECKOUT,
    initialState: {
        confirmation: false,
        cancel: false,
        subscriptionData: false,
        hotelDetails: {}
    },
    reducers: {
        subscriptionRequest() {},
        subscriptionSuccessRequest() {},
        setSubscriptionData(state, action) {
            state.subscriptionData = action.payload;
        },
        setConfirmation(state, action) {
            state.confirmation = action.payload;
        },
        setCancellation(state, action) {
            state.cancel = action.payload;
        },
        setHotelDetails(state, action) {
            state.hotelDetails = action.payload;
        },
        cancelSubscriptionRequest() {}
    }
});

export const {
    subscriptionRequest,
    setSubscriptionData,
    subscriptionSuccessRequest,
    setConfirmation,
    setHotelDetails,
    setCancellation,
    cancelSubscriptionRequest
} = checkoutSlice.actions;

export const checkoutReducer = checkoutSlice.reducer;
