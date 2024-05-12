import { toast } from 'react-toastify';
import { all, takeLatest } from 'redux-saga/effects';
import { forgotPassword, login, register, resetPassword, verify } from '../actions/auth.action';
import {
    forgotPasswordUser,
    loginUser,
    registerUser,
    resetPasswordUser,
    verifyUser
} from '../../services/auth.service';

function* loginUserAsync(action) {
    try {
        const { payload, navigate } = action.payload;
        const res = yield loginUser(payload);
        localStorage.setItem('token', res.token);
        toast.success('Login successfully');
        navigate('/dashboard');
    } catch (error) {
        toast.error(`Failed to login: ${error?.message}`);
        console.error('Failed to login', error);
    }
}

function* registerUserAsync(action) {
    try {
        const { payload, navigate } = action.payload;
        yield registerUser(payload);
        toast.success('User registered successfully. Please verify your email');
        navigate('/');
    } catch (error) {
        toast.error(`Failed to register user: ${error?.message}`);
        console.error('Failed to register', error);
    }
}

function* verifyUserAsync(action) {
    try {
        const { payload, navigate } = action.payload;
        const { token } = yield verifyUser(payload);
        localStorage.setItem('token', token);
        toast.success('Verified successfully');
        navigate('/dashboard');
    } catch (error) {
        toast.error(`Failed to verify email: ${error?.message}`);
        console.error('Failed to verify', error);
    }
}

function* forgotPasswordAsync(action) {
    try {
        const { payload, navigate } = action.payload;
        yield forgotPasswordUser(payload);
        toast.success('Reset password email sent successfully');
        navigate('/');
    } catch (error) {
        toast.error(`Failed to send: ${error?.message}`);
        console.error('Failed to send forget password email', error);
    }
}
function* resetPasswordAsync(action) {
    try {
        const { payload, navigate } = action.payload;
        yield resetPasswordUser(payload);
        toast.success('Password reset successfully');
        navigate('/');
    } catch (error) {
        toast.error(`Failed to reset password: ${error?.message}`);
        console.error('Failed to reset password', error);
    }
}

export default function* authSaga() {
    yield all([
        takeLatest(login().type, loginUserAsync),
        takeLatest(register().type, registerUserAsync),
        takeLatest(verify().type, verifyUserAsync),
        takeLatest(forgotPassword().type, forgotPasswordAsync),
        takeLatest(resetPassword().type, resetPasswordAsync)
    ]);
}
