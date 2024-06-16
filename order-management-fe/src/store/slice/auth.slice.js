import { createSlice } from '@reduxjs/toolkit';
import { USER } from '../types';

const fieldClass = 'col-6 my-2';
const authSlice = createSlice({
    name: USER,
    initialState: {
        data: {},
        updateOptions: {
            firstName: { name: 'firstName', type: 'text', label: 'First Name', className: fieldClass },
            lastName: { name: 'lastName', type: 'text', label: 'Last Name', className: fieldClass },
            newPassword: { name: 'newPassword', type: 'password', label: 'New Password', className: fieldClass },
            confirmPassword: {
                name: 'confirmPassword',
                type: 'password',
                label: 'Confirm Password',
                className: fieldClass
            },
            notification: {
                name: 'notification',
                type: 'switch',
                label: 'Notification Preference',
                className: fieldClass
            },
            payment: { name: 'payment', type: 'switch', label: 'Payment Preference', className: fieldClass }
        },
        formData: false
    },
    reducers: {
        loginRequest() {},
        logoutRequest() {},
        registerRequest() {},
        verifyRequest() {},
        forgotPasswordRequest() {},
        resetPasswordRequest() {},
        getUserRequest() {},
        getUserSuccess(state, action) {
            state.data = action.payload;
        },
        updateUserRequest() {},
        setSettingsFormData(state, action) {
            state.formData = action.payload;
        }
    }
});

export const {
    loginRequest,
    logoutRequest,
    registerRequest,
    verifyRequest,
    forgotPasswordRequest,
    resetPasswordRequest,
    getUserRequest,
    getUserSuccess,
    updateUserRequest,
    setSettingsFormData
} = authSlice.actions;

export const authReducer = authSlice.reducer;
