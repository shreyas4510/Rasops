import * as Yup from 'yup';

export const hotelRegistrationSchema = Yup.object().shape({
    name: Yup.string().min(3).max(30).required('Hotel Name is required'),
    address: Yup.string().min(3).max(30).required('Address is required'),
    careNumber: Yup.string().min(10).max(10).required('Customer Care Number is required')
});
