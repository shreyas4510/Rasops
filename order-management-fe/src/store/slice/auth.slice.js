import { createSlice } from '@reduxjs/toolkit';
import { USER } from '../types';

const authSlice = createSlice({
    name: USER,
    initialState: {},
    reducers: {
        loginRequest() {},
        registerRequest() {},
        verifyRequest() {},
        forgotPasswordRequest() {},
        resetPasswordRequest() {},
        getUserRequest() {},
        getUserSuccess(state, action) {
            state.data = action.payload;
        }
    }
});

export const {
    loginRequest,
    registerRequest,
    verifyRequest,
    forgotPasswordRequest,
    resetPasswordRequest,
    getUserRequest,
    getUserSuccess
} = authSlice.actions;

export const authReducer = authSlice.reducer;
