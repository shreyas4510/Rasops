export const emailTestIdRegex = /email-input/i;
export const passwordTestIdRegex = /password-input/i;

export const requiredCredentials = {
    emailRequiredErrorText: 'Email is required',
    passwordRequiredErrorText: 'Password is required',
    loginText: 'Login'
};

export const validCredentials = {
    emailValidationErrorText: 'Invalid email',
    passwordValidationErrorText:
    'Password must contain at least 8 characters, ' + 'one letter, one number, and one special character',
    emailValue: 'test@test',
    passwordValue: '1234567890',
    loginText: 'Login'
};

export const navigateSignup = {
    signUpText: 'Sign Up',
    path: '/signup'
};

export const navigateForgotPassword = {
    forgotPasswordText: 'Forgot your password ?',
    path: '/forgot-password'
};

export const loginFailed = {
    errorText: 'Failed to register',
    validEmail: 'test@test.com',
    validPassword: 'Test@1234',
    loginText: 'Login',
    toastMessage: 'Failed to login: Failed to register'
};

export const loginSuccess = {
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
  eyJpZCI6MTUsInVzZXJuYW1lIjoia21pbmNoZWxsZSIsImVtYWlsIjoia21pbmNoZWxsZUBxcS5jb20iLCJmaXJzdE5hbWUiOiJKZWFubmUiLCJsYXN0TmFtZSI6IkhhbHZvcnNvbiIsImdlbmRlciI6ImZlbWFsZSIsImltYWdlIjoiaHR0cHM6Ly9yb2JvaGFzaC5vcmcvYXV0cXVpYXV0LnBuZz9zaXplPTUweDUwJnNldD1zZXQxIiwiaWF0IjoxNjM1NzczOTYyLCJleHAiOjE2MzU3Nzc1NjJ9.
  n9PQX8w8ocKo0dMCw3g8bKhjB8Wo7f7IONFBDqfxKhs`,
    validEmail: 'test@test.com',
    validPassword: 'Test@1234',
    loginText: 'Login',
    toastMessage: 'Login successfully',
    path: '/dashboard'
};
