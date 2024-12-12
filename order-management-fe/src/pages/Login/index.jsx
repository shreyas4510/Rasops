import React from 'react';
import CryptoJS from 'crypto-js';
import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';
import CustomButton from '../../components/CustomButton';
import CustomFormGroup from '../../components/CustomFormGroup';
import CustomLink from '../../components/CustomLink';
import env from '../../config/env';
import { loginRequest } from '../../store/slice';
import { loginSchema } from '../../validations/auth';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOnClickSignup = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    const handleOnClickForgotPassword = (e) => {
        e.preventDefault();
        navigate('/forgot-password');
    };

    const initialValues = {
        email: '',
        password: ''
    };

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);
        const enpass = CryptoJS.AES.encrypt(values.password, env.cryptoSecret).toString();
        const data = { ...values, password: enpass };
        dispatch(loginRequest({ data, navigate }));
        setSubmitting(false);
    };

    return (
        <AuthContainer title={'Login'}>
            <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, isValid, dirty }) => (
                    <Form className="d-flex flex-column">
                        <CustomFormGroup name="email" type="email" label="Email" />
                        <CustomFormGroup name="password" type="password" label="Password" />
                        <CustomButton
                            label="Login"
                            disabled={isSubmitting || !isValid || !dirty}
                            type="submit"
                            className="mx-auto my-4"
                        />
                        <div className="text-center">
                            <p className="label-font m-0">
                                {`Don't have an account ? `}
                                <CustomLink onClick={handleOnClickSignup} text="Sign Up" />
                            </p>
                            <p className="label-font m-0">
                                <CustomLink text="Forgot your password ?" onClick={handleOnClickForgotPassword} />
                            </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </AuthContainer>
    );
}

export default Login;
