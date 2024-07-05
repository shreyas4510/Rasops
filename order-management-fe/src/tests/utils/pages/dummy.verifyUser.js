export const notFoundRedirection = {
    path: '/404'
};

const screenText = 'If you not redirected try login';
export const invalidToken = {
    screenText,
    token: 'ewoiZW1haWwiOiAidGVzdEB0ZXN0LmNvbSIKIm5hbWUiOiAidGVzdCB0ZXN0IiwKImV4cGlyZXMiOiAzNjAwCn0=',
    toastMessage: 'Failed to verify email'
};

const token =
  'U2FsdGVkX1/hOPKfcaDk6uZtWfKOviyT4LKCgc+WTlrmwdIKjUrBPakiy5eyZh0h0kEGKKsHv1rbSSdJUtDSrfvJ/' +
  'ZP2cm+4maYefOAIVBCD3DICQ79duS5keLL+MpKi';
export const apiFailure = {
    token,
    toastMessage: 'Failed to verify email: Failure',
    errorMessage: 'Failure'
};

export const apiSuccess = {
    bearerToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
  eyJpZCI6MTUsInVzZXJuYW1lIjoia21pbmNoZWxsZSIsImVtYWlsIjoia21pbmNoZWxsZUBxcS5jb20iLCJmaXJzdE5hbWUiOiJKZWFubmUiLCJsYXN0TmFtZSI6IkhhbHZvcnNvbiIsImdlbmRlciI6ImZlbWFsZSIsImltYWdlIjoiaHR0cHM6Ly9yb2JvaGFzaC5vcmcvYXV0cXVpYXV0LnBuZz9zaXplPTUweDUwJnNldD1zZXQxIiwiaWF0IjoxNjM1NzczOTYyLCJleHAiOjE2MzU3Nzc1NjJ9.
  n9PQX8w8ocKo0dMCw3g8bKhjB8Wo7f7IONFBDqfxKhs`,
    token,
    toastMessage: 'Verified successfully',
    screenText,
    path: '/dashboard'
};
