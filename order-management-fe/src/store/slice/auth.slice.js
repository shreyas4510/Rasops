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
            }
        },
        formData: false,
        notificationsData: { count: 0, data: [], open: false }
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
        },
        setUpdateModalOptions(state, action) {
            state.updateOptions = action.payload;
        },
        setNotificationData(state, action) {
            state.notificationsData = action.payload;
        },
        getNotificationRequest() {},
        updateNotificationRequest() {}
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
    setSettingsFormData,
    setUpdateModalOptions,
    setNotificationData,
    getNotificationRequest,
    updateNotificationRequest
} = authSlice.actions;

export const authReducer = authSlice.reducer;
