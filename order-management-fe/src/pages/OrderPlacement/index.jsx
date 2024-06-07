import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import env from "../../config/env";
import { useDispatch, useSelector } from "react-redux";
import { getHotelDetailsRequest, setCurrentPage, setPlacementData } from "../../store/slice";
import AuthContainer from "../../components/AuthContainer";
import { Form, Formik } from "formik";
import CustomFormGroup from "../../components/CustomFormGroup";
import CustomButton from "../../components/CustomButton";
import { registrationSchema } from "../../validations/place";
import MenuCard from "../../components/MenuCard";

function OrderPlacement() {
    const { token } = useParams();
    const dispatch = useDispatch();
    const { placementData, isRegistered, currentPage } = useSelector(state => state.place);
    const { hotelDetails: data } = useSelector(state => state.hotel);
    const initialValues = {
        name: '',
        email: '',
        phoneNumber: ''
    };

    useEffect(() => {
        if (token) {
            const data = JSON.parse(
                CryptoJS.AES.decrypt(token, env.cryptoSecret).toString(CryptoJS.enc.Utf8)
            )
            dispatch(setPlacementData(data));
            dispatch(getHotelDetailsRequest(data.hotelId));
        }
    }, [token])

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
                const pageNo = (data?.mapping[id] || 0);
                dispatch(setCurrentPage(pageNo));
                break;
            case 'place':
                console.log('handle place order');
                break;
            default:
                break;
        }
    }

    const handleOnChange = (e) => {
        console.log(e.target.name);
        console.log(e.target.value);
    }

    return (
        Object.keys(placementData).length ? (
            !isRegistered ? (
                <AuthContainer title={data.data[0].name}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={registrationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);
                            console.log(values);
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting, isValid, dirty }) => (
                            <Form className="d-flex flex-column">
                                <CustomFormGroup name="name" type="text" label="Name" />
                                <CustomFormGroup name="email" type="email" label="Email" />
                                <CustomFormGroup name="phoneNumber" type="number" label="Phone Number" />
                                <div className="text-center my-4">
                                    <p className="label-font text-secondary m-0">
                                        *Note: Kindly provide accurate details as they will be utilized for payment and invoicing purposes. Thank you!
                                    </p>
                                </div>
                                <CustomButton
                                    label="Submit"
                                    disabled={isSubmitting || !isValid || !dirty}
                                    type="submit"
                                    className="mx-auto"
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
            )
        ) : (
            <></>
        )
    )
}

export default OrderPlacement;
