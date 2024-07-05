import React from 'react';
import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';
import CustomButton from '../../components/CustomButton';
import CustomFormGroup from '../../components/CustomFormGroup';
import CustomLink from '../../components/CustomLink';
import { forgotPasswordRequest } from '../../store/slice';
import { emailSchema } from '../../validations/auth';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialValues = {
        email: ''
    };
    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        dispatch(forgotPasswordRequest({ data: values, navigate }));
        setSubmitting(false);
    };

    const handleOnClickLogin = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <AuthContainer title={'Forgot Password'}>
            <Formik initialValues={initialValues} validationSchema={emailSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, dirty, isValid }) => (
                    <Form className="d-flex flex-column">
                        <CustomFormGroup name="email" type="email" label="Email" />
                        <CustomButton
                            label="Send Email"
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            className="mx-auto my-4"
                        />
                        <div className="text-center">
                            <p className="label-font m-0">
                Already have an account ? <CustomLink onClick={handleOnClickLogin} text="Login" />
                            </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </AuthContainer>
    );
};

export default ForgotPassword;
