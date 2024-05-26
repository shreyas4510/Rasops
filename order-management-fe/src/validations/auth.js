import * as Yup from 'yup';

export const emailRegex = /^[^\s@]+@(?:[^\s@]+\.(?:com|net))$/;
export const userRegistrationSchema = Yup.object().shape({
    firstName: Yup.string().min(3).max(30).required('First Name is required'),
    lastName: Yup.string().min(3).max(30).required('Last Name is required'),
    phoneNumber: Yup.string().min(10).max(10).required('Phone Number is required'),
    email: Yup.string().matches(emailRegex, 'Invalid email').required('Email is required'),
    password: Yup.string()
        .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, one letter, one number, and one special character'
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is a required')
});

export const loginSchema = Yup.object().shape({
    email: Yup.string().matches(emailRegex, 'Invalid email').required('Email is required'),
    password: Yup.string()
        .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, one letter, one number, and one special character'
        )
        .required('Password is required')
});

export const emailSchema = Yup.object().shape({
    email: Yup.string().matches(emailRegex, 'Invalid email').required('Email is required')
});

export const passwordSchema = Yup.object().shape({
    password: Yup.string()
        .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, one letter, one number, and one special character'
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required()
});

export const settingsSchema = Yup.object().shape({
    firstName: Yup.string().min(3).max(30).required(),
    lastName: Yup.string().min(3).max(30).required(),
    newPassword: Yup.string(),
    confirmPassword: Yup.string().when('newPassword', {
        is: (value) => value && value.length > 0,
        then: () =>
            Yup.string()
                .required('Confirm password is required when setting new password.')
                .oneOf([Yup.ref('newPassword'), null], 'Must match new password.'),
        otherwise: () => Yup.string()
    }),
    notification: Yup.boolean().required(),
    payment: Yup.boolean().required()
});
