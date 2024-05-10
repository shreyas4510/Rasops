import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import AuthContainer from '../../components/AuthContainer';
import { loginSchema } from '../../validations/auth';
import { login } from '../../services/user.service';
import env from '../../config/env';
import CustomFormGroup from '../../components/CustomFormGroup';
import CustomButton from '../../components/CustomButton';
import CustomLink from '../../components/CustomLink';

function Login() {
    let navigate = useNavigate();

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

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            const enpass = CryptoJS.AES.encrypt(values.password, env.cryptoSecret).toString();
            const payload = { ...values, password: enpass };

            const res = await login(payload);
            localStorage.setItem('token', res.token);
            toast.success('Login successfully');
            setSubmitting(false);
            navigate('/dashboard');
        } catch (err) {
            setSubmitting(false);
            toast.error(`Failed to login: ${err.message}`);
        }
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
                                Don't have an account ? <CustomLink onClick={handleOnClickSignup} text="Sign Up" />
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
