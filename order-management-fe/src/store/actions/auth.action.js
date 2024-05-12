import {
    FORGOT_PASSWORD_TYPE,
    LOGIN_USER_TYPE,
    REGISTER_USER_TYPE,
    RESET_PASSWORD_TYPE,
    VERIFY_USER_TYPE
} from '../types';

export const { login } = {
    login: (payload) => {
        return {
            type: LOGIN_USER_TYPE,
            payload
        };
    }
};
export const { register } = {
    register: (payload) => {
        return {
            type: REGISTER_USER_TYPE,
            payload
        };
    }
};
export const { verify } = {
    verify: (payload) => {
        return {
            type: VERIFY_USER_TYPE,
            payload
        };
    }
};
export const { forgotPassword } = {
    forgotPassword: (payload) => {
        return {
            type: FORGOT_PASSWORD_TYPE,
            payload
        };
    }
};
export const { resetPassword } = {
    resetPassword: (payload) => {
        return {
            type: RESET_PASSWORD_TYPE,
            payload
        };
    }
};
