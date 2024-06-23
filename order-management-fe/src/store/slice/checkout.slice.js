import { createSlice } from '@reduxjs/toolkit';
import { CHECKOUT } from '../types';

const checkoutSlice = createSlice({
    name: CHECKOUT,
    initialState: {
        confirmation: false,
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
        setHotelDetails(state, action) {
            state.hotelDetails = action.payload;
        }
    }
});

export const {
    subscriptionRequest,
    setSubscriptionData,
    subscriptionSuccessRequest,
    setConfirmation,
    setHotelDetails
} = checkoutSlice.actions;

export const checkoutReducer = checkoutSlice.reducer;
