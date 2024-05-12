export const firstNameTestIdRegex = /firstName-input/i;
export const lastNameTestIdRegex = /lastName-input/i;
export const emailTestIdRegex = /email-input/i;
export const phoneNumberTestIdRegex = /phoneNumber-input/i;
export const passwordTestIdRegex = /password-input/i;
export const confirmPasswordTestIdRegex = /confirmPassword-input/i;

export const requiredFields = {
    errors: {
        firstName: 'First Name is required',
        lastName: 'Last Name is required',
        email: 'Email is required',
        phoneNumber: 'Phone Number is required',
        password: 'Password is required',
        confirmPassword: 'Confirm Password is a required'
    }
};

export const invalidValues = {
    values: {
        firstName: 'asdfghjklqwertyuiopzxcvbnmqwertyuiop',
        lastName: 'asdfghjklqwertyuiopzxcvbnmqwertyuiop',
        email: 'test@test',
    },
    errors: {
        firstName: 'firstName must be at most 30 characters',
        lastName: 'lastName must be at most 30 characters',
        email: 'Invalid email',
    }
};

export const loginNavigation = {
    loginText: 'Login',
    path: '/'
};

const formDetails = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@test.com',
    phoneNumber: '1234567890',
    password: 'Test@1234',
    confirmPassword: 'Test@1234'
};

export const failRegistration = {
    values: { ...formDetails },
    submitText: 'Submit',
    errorMessage: 'Registration failed',
    toastMessage: 'Failed to register user: Registration failed'
};

export const successfulRegistration = {
    values: { ...formDetails },
    submitText: 'Submit',
    toastMessage: 'User registered successfully. Please verify your email',
    path: '/'
};
