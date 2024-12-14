import * as Yup from 'yup';

export const emailRegex = /^[^\s@]+@(?:[^\s@]+\.(?:com|net))$/;
export const userRegistrationSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[A-Za-z]+$/, 'First name must only contain alphabetic characters')
        .min(3, 'Firstname must be at least 3 characters')
        .max(30, 'Firstname can at most be 30 characters')
        .required('Firstname is required'),
    lastName: Yup.string()
        .matches(/^[A-Za-z]+$/, 'Lastname must only contain alphabetic characters')
        .min(3, 'Lastname must be at least 3 characters')
        .max(30, 'Lastname can at most be 30 characters')
        .required('Lastname is required'),
    phoneNumber: Yup.string()
        .min(10, 'Phone number must be exactly 10 digits')
        .max(10, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),
    email: Yup.string().matches(emailRegex, 'Invalid email').required('Email is required'),
    password: Yup.string()
        .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, one letter, one number, and one special character'
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is a required')
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
        .required('Comfirm password is required.')
});

export const settingsSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[A-Za-z]+$/, 'First name must only contain alphabetic characters')
        .min(3, 'First name must be at least 3 characters')
        .max(30, 'First name can at most be 30 characters')
        .required('First Name is required'),
    lastName: Yup.string()
        .matches(/^[A-Za-z]+$/, 'Last name must only contain alphabetic characters')
        .min(3, 'Last name must be at least 3 characters')
        .max(30, 'Last name can at most be 30 characters')
        .required('Last Name is required'),
    newPassword: Yup.string().matches(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least 8 characters, one letter, one number, and one special character'
    ),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    notification: Yup.string().required(),
    payment: Yup.string().required()
});
