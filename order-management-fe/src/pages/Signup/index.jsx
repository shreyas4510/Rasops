import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { Formik, Form } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContainer from '../../components/AuthContainer';
import CustomButton from '../../components/CustomButton';
import CustomFormGroup from '../../components/CustomFormGroup';
import CustomLink from '../../components/CustomLink';
import env from '../../config/env';
import { registerRequest } from '../../store/slice';
import { userRegistrationSchema } from '../../validations/auth';

function Signup() {
    const [initialValues, setInitialValues] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [invite, setInvite] = useState({ status: false, email: '', id: '' });
    useEffect(() => {
        (async () => {
            try {
                const url = new URL(window.location.href);
                const token = decodeURIComponent(url.searchParams.get('token'));
                if (!token || token === 'null') return;

                const data = JSON.parse(CryptoJS.AES.decrypt(token, env.cryptoSecret).toString(CryptoJS.enc.Utf8));
                const keys = Object.keys(data);
                if (keys.length === 3 && keys.includes('email') && keys.includes('inviteId') && keys.includes('expires')) {
                    setInitialValues((prevValues) => ({
                        ...prevValues,
                        email: data.email
                    }));
                    setInvite({ status: true, email: data.email, id: data.inviteId });
                }
            } catch (err) {
                toast.error(`Failed to validate invite: ${err.message}`);
            }
        })();
    }, []);

    // handle request to register user
    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);
        const enpass = CryptoJS.AES.encrypt(values.password, env.cryptoSecret).toString();
        const data = { ...values, password: enpass };
        delete data.confirmPassword;

        if (invite.status) {
            data.invite = invite.id;
        }
        dispatch(registerRequest({ data, navigate }));
        setSubmitting(false);
    };

    const handleOnClickLogin = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <AuthContainer title={'Registration'}>
            <Formik
                initialValues={initialValues}
                validationSchema={userRegistrationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ isSubmitting, isValid, dirty }) => (
                    <Form className="d-flex flex-column">
                        <Row className="mt-2">
                            <Col>
                                <CustomFormGroup name="firstName" type="text" label="First Name" />
                            </Col>
                            <Col>
                                <CustomFormGroup name="lastName" type="text" label="Last Name" />
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col>
                                <CustomFormGroup name="email" type="email" label="Email" disabled={invite.status} />
                            </Col>
                            <Col>
                                <CustomFormGroup name="phoneNumber" type="number" label="Phone Number" />
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col>
                                <CustomFormGroup name="password" type="password" label="Password" />
                            </Col>
                            <Col>
                                <CustomFormGroup name="confirmPassword" type="password" label="Confirm Password" />
                            </Col>
                        </Row>
                        <CustomButton
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            label="Submit"
                            className="mx-auto my-4"
                        />
                        <div className="text-center mx-3">
                            <p className="label-font m-0">
                Already have an account ? <CustomLink text="Login" onClick={handleOnClickLogin} />
                            </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </AuthContainer>
    );
}

export default Signup;
