import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import env from '../../config/env';
import * as service from '../../services/auth.service';
import { USER_ROLES } from '../../utils/constants';
import { getUserRequest, getUserSuccess, setGlobalHotelId, setSettingsFormData } from '../slice';
import {
    FORGOT_PASSWORD_REQUEST,
    GET_USER_REQUEST,
    LOGIN_USER_REQUEST,
    REGISTER_USER_REQUEST,
    RESET_PASSWORD_REQUEST,
    UPDATE_USER_REQUEST,
    VERIFY_USER_REQUEST
} from '../types';

function* loginUserRequestSaga(action) {
    try {
        const { data, navigate } = action.payload;
        const res = yield service.loginUser(data);

        localStorage.setItem('token', res.token);
        localStorage.setItem('data', res.data);

        toast.success('Login successfully');
        yield put(getUserRequest({ navigate }));
    } catch (error) {
        toast.error(`Failed to login: ${error?.message}`);
    }
}

function* registerUserRequestSaga(action) {
    try {
        const { data, navigate } = action.payload;
        yield service.registerUser(data);
        toast.success('User registered successfully. Please verify your email');
        navigate('/');
    } catch (error) {
        toast.error(`Failed to register user: ${error?.message}`);
    }
}

function* verifyUserRequestSaga(action) {
    try {
        const { data, navigate } = action.payload;
        const res = yield service.verifyUser(data);

        localStorage.setItem('token', res.token);
        localStorage.setItem('data', res.data);

        toast.success('Verified successfully');
        yield put(getUserRequest({ navigate }));
    } catch (error) {
        toast.error(`Failed to verify email: ${error?.message}`);
    }
}

function* forgotPasswordRequestSaga(action) {
    try {
        const { data, navigate } = action.payload;
        yield service.forgotPasswordUser(data);
        toast.success('Reset password email sent successfully');
        navigate('/');
    } catch (error) {
        toast.error(`Failed to send: ${error?.message}`);
    }
}

function* resetPasswordRequestSaga(action) {
    try {
        const { data, navigate } = action.payload;
        yield service.resetPasswordUser(data);
        toast.success('Password reset successfully');
        navigate('/');
    } catch (error) {
        toast.error(`Failed to reset password: ${error?.message}`);
    }
}

function* getUserRequestSaga(action) {
    try {
        const navigate = action.payload?.navigate;
        const res = yield service.getUser();
        yield put(getUserSuccess(res));
        if (navigate) {
            const viewData = JSON.parse(
                CryptoJS.AES.decrypt(localStorage.getItem('data'), env.cryptoSecret).toString(CryptoJS.enc.Utf8)
            );

            if (res.role.toUpperCase() === USER_ROLES[0] && Object.keys(viewData).length === 1) {
                navigate('/hotels');
            } else {
                yield put(setGlobalHotelId(res.hotelId || viewData.hotelId));
                navigate('/dashboard');
            }
        }
    } catch (error) {
        console.error(`Failed to get user: ${error?.message}`);
    }
}

function* updateUserRequestSaga(action) {
    try {
        const res = yield service.updateUser(action.payload);
        yield put(getUserSuccess(res));
        toast.success('User details updated successfully');
        yield put(setSettingsFormData(false));
    } catch (error) {
        console.error(`Failed to update user: ${error?.message}`);
        yield put(setSettingsFormData(false));
        toast.error('Failed to update user details');
    }
}

export default function* authSaga() {
    yield all([
        takeLatest(LOGIN_USER_REQUEST, loginUserRequestSaga),
        takeLatest(REGISTER_USER_REQUEST, registerUserRequestSaga),
        takeLatest(VERIFY_USER_REQUEST, verifyUserRequestSaga),
        takeLatest(FORGOT_PASSWORD_REQUEST, forgotPasswordRequestSaga),
        takeLatest(RESET_PASSWORD_REQUEST, resetPasswordRequestSaga),
        takeLatest(GET_USER_REQUEST, getUserRequestSaga),
        takeLatest(UPDATE_USER_REQUEST, updateUserRequestSaga)
    ]);
}
