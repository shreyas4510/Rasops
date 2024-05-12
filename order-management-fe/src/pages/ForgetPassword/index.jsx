import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { emailSchema } from '../../validations/auth';
import AuthContainer from '../../components/AuthContainer';
import CustomFormGroup from '../../components/CustomFormGroup';
import CustomLink from '../../components/CustomLink';
import CustomButton from '../../components/CustomButton';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../store/actions/auth.action';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialValues = {
        email: ''
    };
    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        dispatch(forgotPassword({ payload: values, navigate }));
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
