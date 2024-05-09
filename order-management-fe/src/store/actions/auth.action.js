export const { login } = {
    login: (payload) => {
        return {
            type: "LOGIN/USER_SECTION",
            payload,
        };
    },
};
export const { register } = {
    register: (payload) => {
        return {
            type: "USER/REGISTER_USER",
            payload,
        };
    },
}
export const { verify } = {
    verify: (payload) => {
        return {
            type: "USER/VERIFY_USER",
            payload,
        };
    },
}
export const { forgotPassword } = {
    forgotPassword: (payload) => {
        return {
            type: "USER/FORGOT_PASSWORD",
            payload,
        };
    },
}
export const { resetPassword } = {
    resetPassword: (payload) => {
        return {
            type: "USER/RESET_PASSWORD",
            payload,
        };
    },
}

