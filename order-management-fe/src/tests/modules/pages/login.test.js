import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RouterDom from 'react-router-dom';
import { toast } from 'react-toastify';
import * as apiClient from '../../../api/apiClient';
import Login from '../../../pages/Login';
import ReduxProvider from '../../utils/components/storeWrapper.jsx';
import {
    emailTestIdRegex,
    loginFailed,
    navigateForgotPassword,
    navigateSignup,
    passwordTestIdRegex,
    requiredCredentials,
    validCredentials
} from '../../utils/pages/dummy.login';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

const localStorageMock = {
    setItem: jest.fn(),
    getItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

console.error = jest.fn();

describe('test login page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('test email and password required', async () => {
        render(
            <ReduxProvider>
                <Login />
            </ReduxProvider>
        );

        const { emailRequiredErrorText, passwordRequiredErrorText, loginText } = requiredCredentials;

        // check if the error messages are already not present on screen
        expect(screen.queryByText(emailRequiredErrorText)).toBeNull();
        expect(screen.queryByText(passwordRequiredErrorText)).toBeNull();

        // check occurance of login keyword
        const login = screen.getAllByText(loginText);
        expect(login.length).toBe(2);

        // focus and blur the email field
        const email = screen.getByTestId(emailTestIdRegex);
        email.focus();
        expect(document.activeElement).toBe(email);

        await act(async () => {
            email.blur();
        });
        expect(document.activeElement).not.toBe(email);

        // focus and blur the password field
        const password = screen.getByTestId(passwordTestIdRegex);
        password.focus();
        expect(document.activeElement).toBe(password);

        await act(async () => {
            password.blur();
        });
        expect(document.activeElement).not.toBe(password);

        // check error messages are desplayed on screen
        expect(screen.getByText(emailRequiredErrorText)).toBeInTheDocument();
        expect(screen.getByText(passwordRequiredErrorText)).toBeInTheDocument();
        expect(login[1]).toBeDisabled();
    });

    test('test email and password validations', async () => {
        const { emailValidationErrorText, passwordValidationErrorText, emailValue, passwordValue, loginText } =
            validCredentials;

        render(
            <ReduxProvider>
                <Login />
            </ReduxProvider>
        );
        // check if the error messages are already not present on screen
        expect(screen.queryByText(emailValidationErrorText)).toBeNull();
        expect(screen.queryByText(passwordValidationErrorText)).toBeNull();

        // enter inavlid email in the field
        const email = screen.getByTestId(emailTestIdRegex);
        await act(async () => {
            userEvent.type(email, emailValue);
            email.blur();
        });
        expect(email).toHaveValue(emailValue);

        // enter invalid password in the field
        const password = screen.getByTestId(passwordTestIdRegex);
        await act(async () => {
            userEvent.type(password, passwordValue);
            password.blur();
        });
        expect(password).toHaveValue(passwordValue);

        // check the expected errors displayed on the component
        expect(screen.queryByText(emailValidationErrorText)).toBeInTheDocument();
        expect(screen.queryByText(passwordValidationErrorText)).toBeInTheDocument();
        expect(screen.getAllByText(loginText)[1]).toBeDisabled();
    });

    test('test navigate to signup page', async () => {
        const { signUpText, path } = navigateSignup;
        // spy on the useNavigate function
        const navigate = jest.fn();
        jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

        // click on the sign up link
        const { getByText } = render(
            <ReduxProvider>
                <Login />
            </ReduxProvider>
        );
        const signup = getByText(signUpText);
        userEvent.click(signup);

        // check the naviaget function was called with /signup route
        expect(navigate).toHaveBeenCalledWith(path);
    });

    test('test navigate to forgot passwrod page', async () => {
        const { forgotPasswordText, path } = navigateForgotPassword;
        // spy on the useNavigate function
        const navigate = jest.fn();
        jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

        // click om forgot password link
        const { getByText } = render(
            <ReduxProvider>
                <Login />
            </ReduxProvider>
        );
        const forgotPassword = getByText(forgotPasswordText);
        userEvent.click(forgotPassword);

        // check the navigate function was called with /forgot-password route
        expect(navigate).toHaveBeenCalledWith(path);
    });

    test('test api error', async () => {
        const { errorText, validEmail, validPassword, loginText, toastMessage } = loginFailed;
        // Mock the API function before rendering the component
        jest.spyOn(apiClient, 'api').mockRejectedValue(new Error(errorText));

        // render the login api
        render(
            <ReduxProvider>
                <Login />
            </ReduxProvider>
        );
        // type email in the email field
        const email = screen.getByTestId(emailTestIdRegex);
        await act(async () => {
            userEvent.type(email, validEmail);
            email.blur();
        });
        expect(email).toHaveValue(validEmail);

        // type password in the password field
        const password = screen.getByTestId(passwordTestIdRegex);
        await act(async () => {
            userEvent.type(password, validPassword);
            password.blur();
        });
        expect(password).toHaveValue(validPassword);

        // check the button is no more disabled
        const login = screen.getAllByText(loginText);
        expect(login[1]).not.toBeDisabled();

        // mock the toast function
        jest.spyOn(toast, 'error');
        await act(async () => {
            userEvent.click(login[1]);
        });

        expect(toast.error).toHaveBeenCalledWith(toastMessage);
    });

    // test('test successful login', async () => {
    //     const { token, validEmail, validPassword, loginText, toastMessage, path } = loginSuccess;

    //     jest.spyOn(apiClient, 'api').mockResolvedValue({ token });

    //     const navigate = jest.fn();
    //     jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

    //     render(
    //         <ReduxProvider>
    //             <Login />
    //         </ReduxProvider>
    //     );

    //     const email = screen.getByTestId(emailTestIdRegex);
    //     await act(async () => {
    //         userEvent.type(email, validEmail);
    //         email.blur();
    //     });

    //     const password = screen.getByTestId(passwordTestIdRegex);
    //     await act(async () => {
    //         userEvent.type(password, validPassword);
    //         password.blur();
    //     });

    //     const login = screen.getAllByText(loginText);
    //     expect(login[1]).not.toBeDisabled();

    //     jest.spyOn(toast, 'success');
    //     await act(async () => {
    //         userEvent.click(login[1]);
    //     });

    //     expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
    //     expect(toast.success).toHaveBeenCalledWith(toastMessage);
    //     expect(navigate).toHaveBeenCalledWith(path);
    // });
});
