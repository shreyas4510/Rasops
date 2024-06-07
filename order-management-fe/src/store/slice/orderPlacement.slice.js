import { createSlice } from '@reduxjs/toolkit';
import { ORDER_PLACEMENT } from '../types/place';

const orderPlacementSlice = createSlice({
    name: ORDER_PLACEMENT,
    reducers: {
        setPlacementData( state, action ) {
            state.placementData = action.payload;
        },
        setIsRegistered( state, action ) {
            state.isRegistered = action.payload;
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        }
    },
    initialState: {
        placementData: {},
        isRegistered: true,
        currentPage: 0
    }
});
export const {
    setPlacementData,
    setCurrentPage
} = orderPlacementSlice.actions;

export const orderPlacementReducer = orderPlacementSlice.reducer;
