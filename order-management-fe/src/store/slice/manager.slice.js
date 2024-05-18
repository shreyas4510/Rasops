import { createSlice } from '@reduxjs/toolkit';
import { MANAGER } from '../types';

const managerSlice = createSlice({
    name: MANAGER,
    initialState: {
        data: {}
    },
    reducers: {
        getManagers() {},
        getManagerSuccess(state, action) {
            state.data = action.payload;
        }
    }
});

export const { getManagers, getManagerSuccess } = managerSlice.actions;

export const managerReducer = managerSlice.reducer;
