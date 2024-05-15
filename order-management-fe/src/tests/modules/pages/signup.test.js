import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import RouterDom from 'react-router-dom';
import { toast } from 'react-toastify';
import * as apiClient from '../../../api/apiClient.js';
import Signup from '../../../pages/Signup/index.jsx';
import ReduxProvider from '../../utils/components/storeWrapper.jsx';
import {
    confirmPasswordTestIdRegex,
    emailTestIdRegex,
    failRegistration,
    firstNameTestIdRegex,
    invalidValues,
    lastNameTestIdRegex,
    loginNavigation,
    passwordTestIdRegex,
    phoneNumberTestIdRegex,
    requiredFields,
    successfulRegistration
} from '../../utils/pages/dummy.signup.js';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

console.error = jest.fn();

describe('test signup page', () => {
    test('test required field validations', async () => {
        const { errors } = requiredFields;

        render(
            <ReduxProvider>
                <Signup />
            </ReduxProvider>
        );

        // testing the required error for first name field
        expect(screen.queryByText(errors.firstName)).not.toBeInTheDocument();
        const firstNameInput = screen.getByTestId(firstNameTestIdRegex);
        firstNameInput.focus();
        expect(document.activeElement).toBe(firstNameInput);
        await act(async () => {
            firstNameInput.blur();
        });
        expect(document.activeElement).not.toBe(firstNameInput);
        expect(screen.getByText(errors.firstName)).toBeInTheDocument();

        // testing the required error for last name field
        expect(screen.queryByText(errors.lastName)).not.toBeInTheDocument();
        const lastNameInput = screen.getByTestId(lastNameTestIdRegex);
        lastNameInput.focus();
        expect(document.activeElement).toBe(lastNameInput);
        await act(async () => {
            lastNameInput.blur();
        });
        expect(document.activeElement).not.toBe(lastNameInput);
        expect(screen.getByText(errors.lastName)).toBeInTheDocument();

        // testing the required error for email field
        expect(screen.queryByText(errors.email)).not.toBeInTheDocument();
        const emailInput = screen.getByTestId(emailTestIdRegex);
        emailInput.focus();
        expect(document.activeElement).toBe(emailInput);
        await act(async () => {
            emailInput.blur();
        });
        expect(document.activeElement).not.toBe(emailInput);
        expect(screen.getByText(errors.email)).toBeInTheDocument();

        // testing the required error for phone number field
        expect(screen.queryByText(errors.phoneNumber)).not.toBeInTheDocument();
        const phoneNumberInput = screen.getByTestId(phoneNumberTestIdRegex);
        phoneNumberInput.focus();
        expect(document.activeElement).toBe(phoneNumberInput);
        await act(async () => {
            phoneNumberInput.blur();
        });
        expect(document.activeElement).not.toBe(phoneNumberInput);
        expect(screen.getByText(errors.phoneNumber)).toBeInTheDocument();

        // testing the required error for password field
        expect(screen.queryByText(errors.password)).not.toBeInTheDocument();
        const passwordInput = screen.getAllByTestId(passwordTestIdRegex);
        passwordInput[0].focus();
        expect(document.activeElement).toBe(passwordInput[0]);
        await act(async () => {
            passwordInput[0].blur();
        });
        expect(document.activeElement).not.toBe(passwordInput[0]);
        expect(screen.getByText(errors.password)).toBeInTheDocument();

        // testing the required error for confirm password field
        expect(screen.queryByText(errors.confirmPassword)).not.toBeInTheDocument();
        const cpasswordInput = screen.getByTestId(confirmPasswordTestIdRegex);
        cpasswordInput.focus();
        expect(document.activeElement).toBe(cpasswordInput);
        await act(async () => {
            cpasswordInput.blur();
        });
        expect(document.activeElement).not.toBe(cpasswordInput);
        expect(screen.getByText(errors.confirmPassword)).toBeInTheDocument();
    });

    test('test valid valued for fields validations', async () => {
        const { values, errors } = invalidValues;
        render(
            <ReduxProvider>
                <Signup />
            </ReduxProvider>
        );
        // testing the validation error for first name field
        expect(screen.queryByText(errors.firstName)).not.toBeInTheDocument();
        expect(screen.queryByText(errors.lastName)).not.toBeInTheDocument();
        expect(screen.queryByText(errors.email)).not.toBeInTheDocument();

        const firstNameInput = screen.getByTestId(firstNameTestIdRegex);
        const lastNameInput = screen.getByTestId(lastNameTestIdRegex);
        const emailInput = screen.getByTestId(emailTestIdRegex);

        await act(async () => {
            userEvent.type(firstNameInput, values.firstName);
            userEvent.type(lastNameInput, values.lastName);
            userEvent.type(emailInput, values.email);
            emailInput.blur();
        });
        expect(screen.getByText(errors.firstName)).toBeInTheDocument();
        expect(screen.getByText(errors.lastName)).toBeInTheDocument();
        expect(screen.getByText(errors.email)).toBeInTheDocument();
    });

    test('test navigation to login', async () => {
        const { loginText, path } = loginNavigation;

        const navigate = jest.fn();
        jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <ReduxProvider>
                <Signup />
            </ReduxProvider>
        );
        const login = screen.getByText(loginText);
        userEvent.click(login);

        // check the navigation is done to login screen
        expect(navigate).toHaveBeenCalledWith(path);
    });

    test('test failure of registration', async () => {
        const { values, submitText, errorMessage, toastMessage } = failRegistration;

        jest.spyOn(apiClient, 'api').mockRejectedValue(new Error(errorMessage));
        jest.spyOn(toast, 'error');

        render(
            <ReduxProvider>
                <Signup />
            </ReduxProvider>
        );
        // get all the fields of the form
        const obj = {
            firstNameInput: screen.getByTestId(firstNameTestIdRegex),
            lastNameInput: screen.getByTestId(lastNameTestIdRegex),
            emailInput: screen.getByTestId(emailTestIdRegex),
            phoneNumberInput: screen.getByTestId(phoneNumberTestIdRegex),
            passwordInput: screen.getAllByTestId(passwordTestIdRegex)[0],
            cpasswordInput: screen.getByTestId(confirmPasswordTestIdRegex)
        };

        // fill the form with appropriate values
        await act(async () => {
            userEvent.type(obj.firstNameInput, values.firstName);
            userEvent.type(obj.lastNameInput, values.lastName);
            userEvent.type(obj.emailInput, values.email);
            userEvent.type(obj.phoneNumberInput, values.phoneNumber);
            userEvent.type(obj.passwordInput, values.password);
            userEvent.type(obj.cpasswordInput, values.confirmPassword);
        });

        // submit the form
        const submit = screen.getByText(submitText);
        expect(submit).not.toBeDisabled();
        await act(async () => {
            userEvent.click(submit);
        });

        // expect the error message from the api failure
        expect(toast.error).toHaveBeenCalledWith(toastMessage);
    });

    test('test success in registration', async () => {
        const { values, submitText, path, toastMessage } = successfulRegistration;

        jest.spyOn(apiClient, 'api').mockResolvedValue({});
        jest.spyOn(toast, 'success');

        const navigate = jest.fn();
        jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <ReduxProvider>
                <Signup />
            </ReduxProvider>
        );
        // get all the fields on the registration form
        const obj = {
            firstNameInput: screen.getByTestId(firstNameTestIdRegex),
            lastNameInput: screen.getByTestId(lastNameTestIdRegex),
            emailInput: screen.getByTestId(emailTestIdRegex),
            phoneNumberInput: screen.getByTestId(phoneNumberTestIdRegex),
            passwordInput: screen.getAllByTestId(passwordTestIdRegex)[0],
            cpasswordInput: screen.getByTestId(confirmPasswordTestIdRegex)
        };

        // fill the form with appropriate values
        await act(async () => {
            userEvent.type(obj.firstNameInput, values.firstName);
            userEvent.type(obj.lastNameInput, values.lastName);
            userEvent.type(obj.emailInput, values.email);
            userEvent.type(obj.phoneNumberInput, values.phoneNumber);
            userEvent.type(obj.passwordInput, values.password);
            userEvent.type(obj.cpasswordInput, values.confirmPassword);
        });

        // submit the form
        const submit = screen.getByText(submitText);
        expect(submit).not.toBeDisabled();
        await act(async () => {
            userEvent.click(submit);
        });

        // on success compare the toast message and navigation
        expect(toast.success).toHaveBeenCalledWith(toastMessage);
        expect(navigate).toHaveBeenCalledWith(path);
    });
});
