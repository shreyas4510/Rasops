export const emailTestIdRegex = /email-input/i;

const submitText = 'Send Email';
export const requiredFields = {
    errorMessage: 'Email is required',
    submitText
};

export const validateCredentials = {
    values: { email: 'qwerty' },
    error: { message: 'Invalid email' },
    submitText
};

const email = 'test@test.com';
export const failedRequest = {
    values: { email },
    errors: { message: 'Mail sending failed' },
    submitText,
    toastMessage: 'Failed to send: Mail sending failed'
};

export const successRequest = {
    values: { email },
    submitText,
    toastMessage: 'Reset password email sent successfully',
    path: '/'
};
