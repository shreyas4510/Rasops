import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import RouterDom from "react-router-dom";
import ForgotPassword from "../../../pages/ForgetPassword/index.jsx";
import * as apiClient from "../../../api/apiClient.js";
import { emailTestIdRegex, failedRequest, requiredFields, successRequest, validateCredentials } from "../../utils/pages/dummy.forgotPassword.js";
import ReduxProvider from "../../utils/components/storeWrapper.jsx";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

console.error = jest.fn();

describe('test forgot password page', () => {
    test('test required fields', async () => {
        const { errorMessage, submitText } = requiredFields;
        render(
            <ReduxProvider>
                <ForgotPassword />
            </ReduxProvider>
        )

        // expect the error message to not be on screen
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

        // focus and blur the email field
        const emailInput = screen.getByTestId(emailTestIdRegex);
        emailInput.focus();
        await act(async () => { emailInput.blur(); });

        // expect the error message to be on screen and the submit button is disabled
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByText(submitText)).toBeDisabled();
    });

    test('test invalid email', async () => {
        const { error, values, submitText } = validateCredentials;
        render(
            <ReduxProvider>
                <ForgotPassword />
            </ReduxProvider>
        )

        // check the error message is not already on the screen
        expect(screen.queryByText(error.message)).not.toBeInTheDocument();

        // find and fill the email input box with invalid email
        const emailInput = screen.getByTestId(emailTestIdRegex);
        await act(async () => {
            userEvent.type(emailInput, values.email);
            emailInput.blur();
        });

        // expect the error message on th screen and submit button is disabled
        expect(screen.getByText(error.message)).toBeInTheDocument();
        expect(screen.getByText(submitText)).toBeDisabled();
    });

    test('test api failure', async () => {
        const { values, errors, submitText, toastMessage } = failedRequest;
        jest.spyOn(apiClient, 'api').mockRejectedValue(new Error(errors.message));
        jest.spyOn(toast, 'error');

        render(
            <ReduxProvider>
                <ForgotPassword />
            </ReduxProvider>
        )

        // fill the email field with valid email.
        const emailInput = screen.getByTestId(emailTestIdRegex);
        await act(async () => { userEvent.type(emailInput, values.email) });

        // find and click the submit button
        const sumbit = screen.getByText(submitText);
        expect(sumbit).not.toBeDisabled();
        await act(async () => {
            userEvent.click(sumbit);
        });

        // expect the toast on api failure
        expect(toast.error).toHaveBeenCalledWith(toastMessage);
    });

    test('test api success', async () => {
        const { values, submitText, toastMessage, path } = successRequest;

        jest.spyOn(apiClient, 'api').mockResolvedValue({});
        jest.spyOn(toast, 'success');

        const navigate = jest.fn();
        jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <ReduxProvider>
                <ForgotPassword />
            </ReduxProvider>
        )

        // fill the email input box
        const emailInput = screen.getByTestId(emailTestIdRegex);
        await act(async () => { userEvent.type(emailInput, values.email) });

        // check the submit button is not disabled and click
        const submit = screen.getByText(submitText);
        expect(submit).not.toBeDisabled();
        await act(async () => {
            userEvent.click(submit);
        });

        // expect succes toaster after api success and navigate to login screen
        expect(toast.success).toHaveBeenCalledWith(toastMessage);
        expect(navigate).toHaveBeenCalledWith(path);
    });
});
