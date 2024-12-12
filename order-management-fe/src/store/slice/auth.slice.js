import { createSlice } from '@reduxjs/toolkit';
import { FIELD_CLASS } from '../../utils/constants';
import { USER } from '../types';

const authSlice = createSlice({
    name: USER,
    initialState: {
        data: {},
        updateOptions: {
            firstName: { name: 'firstName', type: 'text', label: 'First Name', className: FIELD_CLASS },
            lastName: { name: 'lastName', type: 'text', label: 'Last Name', className: FIELD_CLASS },
            newPassword: { name: 'newPassword', type: 'password', label: 'New Password', className: FIELD_CLASS },
            confirmPassword: {
                name: 'confirmPassword',
                type: 'password',
                label: 'Confirm Password',
                className: FIELD_CLASS
            }
        },
        formData: false,
        notificationsData: { count: 0, data: [], open: false },
        verifyUsername: ''
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
        setVerifyUserName(state, action) {
            state.verifyUsername = action.payload;
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
    updateNotificationRequest,
    setVerifyUserName
} = authSlice.actions;

export const authReducer = authSlice.reducer;
