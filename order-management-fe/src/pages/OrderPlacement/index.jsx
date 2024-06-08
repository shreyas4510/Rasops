import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import env from '../../config/env';
import { useDispatch, useSelector } from 'react-redux';
import {
    getHotelDetailsRequest,
    getTableDetailsRequest,
    registerCustomerRequest,
    setCurrentPage
} from '../../store/slice';
import AuthContainer from '../../components/AuthContainer';
import { Form, Formik } from 'formik';
import CustomFormGroup from '../../components/CustomFormGroup';
import CustomButton from '../../components/CustomButton';
import { customerRegistrationSchema } from '../../validations/orderPlacement';
import MenuCard from '../../components/MenuCard';
import Loader from '../../components/Loader';

const TABLE_STATUS = { open: 'OPEN', booked: 'BOOKED' };
function OrderPlacement() {
    const { token } = useParams();
    const dispatch = useDispatch();
    const { currentPage, tableDetails } = useSelector((state) => state.place);
    const { hotelDetails: data } = useSelector((state) => state.hotel);

    const initialValues = {
        name: '',
        email: '',
        phoneNumber: '',
        confirmation: false
    };

    useEffect(() => {
        if (token) {
            const data = JSON.parse(CryptoJS.AES.decrypt(token, env.cryptoSecret).toString(CryptoJS.enc.Utf8));

            dispatch(getTableDetailsRequest(data.tableId));
            dispatch(getHotelDetailsRequest(data.hotelId));
        }
    }, [token]);

    const handleClick = ({ action, id = '' }) => {
        switch (action) {
            case 'next':
                dispatch(setCurrentPage(currentPage + 1));
                break;
            case 'prev':
                dispatch(setCurrentPage(currentPage - 1));
                break;
            case 'category':
                dispatch(setCurrentPage(1));
                break;
            case 'check-in':
                const pageNo = data?.mapping[id] || 0;
                dispatch(setCurrentPage(pageNo));
                break;
            case 'place':
                console.log('handle place order');
                break;
            default:
                break;
        }
    };

    const handleOnChange = (e) => {
        console.log(e.target.name);
        console.log(e.target.value);
    };

    const handleRegisterCustomer = (values, { setSubmitting }) => {
        setSubmitting(true);
        const hotelId = data.id;
        const tableId = tableDetails.id;

        const payload = {
            ...values,
            hotelId,
            tableId
        };

        delete payload.confirmation;
        dispatch(registerCustomerRequest(payload));
        setSubmitting(false);
    };

    if (!Object.keys(tableDetails).length || !Object.keys(data).length) {
        return <Loader />;
    }

    return tableDetails.status === TABLE_STATUS.open ? (
        <AuthContainer title={data.name}>
            <Formik
                initialValues={initialValues}
                validationSchema={customerRegistrationSchema}
                onSubmit={handleRegisterCustomer}
            >
                {({ isSubmitting, setFieldValue, isValid, dirty }) => (
                    <Form className="d-flex flex-column">
                        <CustomFormGroup name="name" type="text" label="Name" />
                        <CustomFormGroup name="email" type="email" label="Email" />
                        <CustomFormGroup name="phoneNumber" type="number" label="Phone Number" />
                        <div className="d-flex mt-2 align-items-center">
                            <CustomFormGroup
                                name="confirmation"
                                setFieldValue={setFieldValue}
                                type="checkbox"
                                className="none"
                            />
                            <p className="label-font text-secondary m-0 mx-2" style={{ fontSize: '12px' }}>
                                I confirm the details are correct for payments and invoices.
                            </p>
                        </div>
                        <CustomButton
                            label="Submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            type="submit"
                            className="mx-auto mt-4"
                        />
                    </Form>
                )}
            </Formik>
        </AuthContainer>
    ) : (
        <MenuCard
            name={data.name}
            data={data.data}
            count={data.count}
            currentPage={currentPage}
            handleClick={handleClick}
            handleOnChange={handleOnChange}
        />
    );
}

export default OrderPlacement;
