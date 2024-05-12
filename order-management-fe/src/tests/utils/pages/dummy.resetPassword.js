export const passwordTestIdRegex = /password-input/i;
export const confirmPasswordTestIdRegex = /confirmPassword-input/i;

export const notFoundRedirection = {
    path: '/404'
};

export const invalidToken = {
    token: 'ewplbWFpbDogJ3Rlc3RAdGVzdC5jb20nLApleHBpcmVzOiAzNjAwCn0=',
    toastMessage: 'Failed to verify email',
    screenText: 'Reset Password'
};

export const token = 'U2FsdGVkX1+sc8x4jWQQ/tSCYwCRiIcK4Wtx7CBrzD8jjnptwRgSR2mDuU96c008JYBU5/r9XPHeACkqKSrXXQ==';
const screenText = 'Reset Password';
const submitText = 'Reset';
export const validToken = {
    screenText
};

export const invalidCredentials = {
    screenText,
    submitText,
    values: {
        password: '1234567890',
        cpassword: '0987654321'
    },
    errors: {
        password: 'Password must contain at least 8 characters, one letter, one number, and one special character',
        cpassword: 'Passwords must match'
    }
};

export const apiFailure = {
    screenText,
    submitText,
    values: {
        password: 'Test@1234',
        cpassword: 'Test@1234'
    },
    error: { message: 'failed to send email' },
    toastMessage: 'Failed to reset password: failed to send email'
};

export const apiSuccess = {
    screenText,
    submitText,
    values: {
        password: 'Test@1234',
        cpassword: 'Test@1234'
    },
    toastMessage: 'Password reset successfully',
    path: '/'
};
