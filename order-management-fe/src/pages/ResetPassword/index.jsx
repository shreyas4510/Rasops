import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContainer from '../../components/AuthContainer';
import CustomButton from '../../components/CustomButton';
import CustomFormGroup from '../../components/CustomFormGroup';
import env from '../../config/env';
import { resetPasswordRequest } from '../../store/slice';
import { passwordSchema } from '../../validations/auth';

const ResetPassword = () => {
    const [data, setData] = useState('');
    const navigate = useNavigate();
    const initialValues = {
        password: '',
        confirmPassword: ''
    };
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const url = new URL(window.location.href);
                const token = decodeURIComponent(url.searchParams.get('token'));
                if (!token) {
                    navigate('/404');
                    return;
                }
                const data = JSON.parse(CryptoJS.AES.decrypt(token, env.cryptoSecret).toString(CryptoJS.enc.Utf8));
                const keys = Object.keys(data);
                if (keys.length === 2 && keys.includes('email') && keys.includes('expires')) {
                    setData({ email: data.email, expires: data.expires });
                }
            } catch (err) {
                toast.error(`Failed to verify email: ${err.message}`);
            }
        })();
    }, []);

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);
        const enpass = CryptoJS.AES.encrypt(values.password, env.cryptoSecret).toString();
        dispatch(resetPasswordRequest({ data: { newPassword: enpass, ...data }, navigate }));
        setSubmitting(false);
    };

    return (
        data && (
            <AuthContainer title="Reset Password">
                <Formik initialValues={initialValues} validationSchema={passwordSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, dirty, isValid }) => (
                        <Form className="d-flex flex-column">
                            <CustomFormGroup name="password" type="password" label="New Passwoord" />
                            <CustomFormGroup name="confirmPassword" type="password" label="Confirm Passwoord" />
                            <CustomButton
                                label="Reset"
                                disabled={isSubmitting || !isValid || !dirty}
                                type="submit"
                                className="mx-auto my-4"
                            />
                        </Form>
                    )}
                </Formik>
            </AuthContainer>
        )
    );
};

export default ResetPassword;
