import * as Yup from 'yup';

export const emailRegex = /^[^\s@]+@(?:[^\s@]+\.(?:com|net))$/;
export const customerRegistrationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phoneNumber: Yup.string().min(10).max(10).required('Phone Number is required'),
    email: Yup.string().matches(emailRegex, 'Invalid email').required('Email is required'),
    confirmation: Yup.boolean().test('is-true', '', (value) => value)
});
