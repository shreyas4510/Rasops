import * as Yup from 'yup';

export const hotelRegistrationSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Hotel name must be at least 3 characters')
        .max(30, 'Hotel name can at most be 30 characters')
        .required('Hotel Name is required'),
    address: Yup.string()
        .min(10, 'Hotel address must be at least 10 characters')
        .max(100, 'Hotel address can at most be 100 characters')
        .required('Address is required'),
    careNumber: Yup.string()
        .min(10, 'Customer care number must be at most 10 digits')
        .max(10, 'Customer care number must be at most 10 digits')
        .required('Customer Care Number is required')
});
