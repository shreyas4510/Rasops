import React from 'react';
import { render, screen } from '@testing-library/react';
import RouterDom from 'react-router-dom';
import { toast } from 'react-toastify';
import { act } from 'react-test-renderer';
import userEvent from '@testing-library/user-event';

import ResetPassword from '../../../pages/ResetPassword/index.jsx';
import {
	invalidToken,
	notFoundRedirection,
	validToken,
	token,
	invalidCredentials,
	passwordTestIdRegex,
	confirmPasswordTestIdRegex,
	apiFailure,
	apiSuccess
} from '../../utils/pages/dummy.resetPassword.js';
import * as apiClient from '../../../api/apiClient.js';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn()
}));

console.error = jest.fn();

describe('test reset password page', () => {
	test('test redirect to 404', () => {
		const { path } = notFoundRedirection;

		// mock url to be called with empty token
		window.history.pushState({}, 'test page', '/?token=');

		const navigate = jest.fn();
		jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

		render(<ResetPassword />);

		// expected to be redirected to /404
		expect(navigate).toHaveBeenCalledWith(path);
	});

	test('test invalid token', () => {
		const { screenText, toastMessage, token } = invalidToken;
		// mock url with invalid token
		window.history.pushState({}, 'Test page', `/?token=${encodeURIComponent(token)}`);

		jest.spyOn(toast, 'error');
		render(<ResetPassword />);

		// expected toast message with error message and the reset password is not rendered
		expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(toastMessage));
		expect(screen.queryByText(screenText)).not.toBeInTheDocument();
	});

	test('test valid token', () => {
		const { screenText } = validToken;

		// mock the url with valid token
		window.history.pushState({}, 'Test page', `/?token=${encodeURIComponent(token)}`);
		render(<ResetPassword />);

		// check the screen is rendered
		expect(screen.getByText(screenText)).toBeInTheDocument();
	});

	test('test invalid credentials', async () => {
		const { screenText, values, errors, submitText } = invalidCredentials;

		// mock the url with valid token
		window.history.pushState({}, 'Test page', `/?token=${encodeURIComponent(token)}`);
		render(<ResetPassword />);

		// check the screen is rendered
		expect(screen.getByText(screenText)).toBeInTheDocument();

		const inputs = {
			password: screen.getAllByTestId(passwordTestIdRegex)[0],
			cpassword: screen.getByTestId(confirmPasswordTestIdRegex)
		};

		// add password and confirm password fields values
		await act(async () => {
			userEvent.type(inputs.password, values.password);
			userEvent.type(inputs.cpassword, values.cpassword);

			inputs.password.blur();
			inputs.cpassword.blur();
		});

		// expect the password and confirm password error to be displayed on screen
		expect(screen.getByText(errors.password)).toBeInTheDocument();
		expect(screen.getByText(errors.cpassword)).toBeInTheDocument();
		expect(screen.getByText(submitText)).toBeDisabled();
	});

	test('test failed api request', async () => {
		const { screenText, values, submitText, error, toastMessage } = apiFailure;

		// mock the url with valid token
		window.history.pushState({}, 'Test page', `/?token=${encodeURIComponent(token)}`);
		jest.spyOn(apiClient, 'api').mockRejectedValue(new Error(error.message));
		jest.spyOn(toast, 'error');

		render(<ResetPassword />);

		// check the screen is rendered
		expect(screen.getByText(screenText)).toBeInTheDocument();

		const inputs = {
			password: screen.getAllByTestId(passwordTestIdRegex)[0],
			cpassword: screen.getByTestId(confirmPasswordTestIdRegex)
		};

		await act(async () => {
			userEvent.type(inputs.password, values.password);
			userEvent.type(inputs.cpassword, values.cpassword);

			inputs.password.blur();
			inputs.cpassword.blur();
		});

		// click on the button
		const submit = screen.getByText(submitText);
		expect(submit).not.toBeDisabled();
		await act(async () => {
			userEvent.click(submit);
		});

		// compare the error toast message
		expect(toast.error).toHaveBeenCalledWith(toastMessage);
	});

	test('test success api request', async () => {
		const { screenText, values, submitText, path, toastMessage } = apiSuccess;

		// mock the url with valid token
		window.history.pushState({}, 'Test page', `/?token=${encodeURIComponent(token)}`);
		jest.spyOn(apiClient, 'api').mockResolvedValue({});
		jest.spyOn(toast, 'success');

		const navigate = jest.fn();
		jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

		render(<ResetPassword />);

		// check the screen is rendered
		expect(screen.getByText(screenText)).toBeInTheDocument();

		const inputs = {
			password: screen.getAllByTestId(passwordTestIdRegex)[0],
			cpassword: screen.getByTestId(confirmPasswordTestIdRegex)
		};

		// enter the values in the input fields
		await act(async () => {
			userEvent.type(inputs.password, values.password);
			userEvent.type(inputs.cpassword, values.cpassword);

			inputs.password.blur();
			inputs.cpassword.blur();
		});

		// the button is enabled and clicked
		const submit = screen.getByText(submitText);
		expect(submit).not.toBeDisabled();
		await act(async () => {
			userEvent.click(submit);
		});

		// check the toast message and navigate to login screen
		expect(toast.success).toHaveBeenCalledWith(toastMessage);
		expect(navigate).toHaveBeenCalledWith(path);
	});
});
