import { toast } from "react-toastify";
import { all, takeLatest } from "redux-saga/effects";
import { forgotPassword, login, register, resetPassword, verify } from "../actions/auth.action";
import {forgotPasswordUser, loginUser, registerUser, resetPasswordUser, verifyUser} from '../../services/auth.service'

function* loginUserAsync(action) {
    const { payload, navigate } = action.payload;
    try {
        const res = yield loginUser(payload);
        if (res.data?.status === "ACTIVE") {
            localStorage.setItem("token", res.token);
            toast.success("Login successfully");
            navigate("/dashboard");
        }
    } catch (error) {
        console.log("err: ", error);
    }
}

function* registerUserAsync(action) {
    const { payload, navigate } = action.payload;
    try {
        const res = yield registerUser(payload);
        console.log("register res=", res);
        toast.success("User registered successfully. Please verify your email");
        navigate("/");
    } catch (error) {
        console.log("err: ", error);
    }
}

function* verifyUserAsync(action) {
    const { payload, navigate } = action.payload;
    try {
        const res = yield verifyUser(payload);
        localStorage.setItem("token", res.token);
        toast.success("Verified successfully");
        navigate("/dashboard");
    } catch (error) {
        console.log("err: ", error);
    }
}

function* forgotPasswordAsync(action) {
    const { payload, navigate } = action.payload;
    try {
        const res = yield forgotPasswordUser(payload);
        toast.success('Reset password email sent successfully');
        navigate('/');
       
    } catch (error) {
        console.log("err: ", error);
    }
}
function* resetPasswordAsync(action) {
    const { payload, navigate } = action.payload;
    try {
        const res = yield resetPasswordUser(payload);
        toast.success('Password reset successfully');
        navigate('/');
       
    } catch (error) {
        console.log("err: ", error);
    }
}

export default function* authSaga() {
    yield all([
          takeLatest(login().type, loginUserAsync),
          takeLatest(register().type, registerUserAsync),
          takeLatest(verify().type, verifyUserAsync),
          takeLatest(forgotPassword().type, forgotPasswordAsync),
          takeLatest(resetPassword().type, resetPasswordAsync),
        ]);
}
