import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RouterDom from 'react-router-dom';
import { toast } from 'react-toastify';
import * as apiClient from '../../../api/apiClient.js';
import VerifyUser from '../../../pages/VerifyUser/index.jsx';
import ReduxProvider from '../../utils/components/storeWrapper.jsx';
import { apiFailure, apiSuccess, invalidToken, notFoundRedirection } from '../../utils/pages/dummy.verifyUser.js';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

const localStorageMock = {
    setItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

console.error = jest.fn();

describe('test verify user page', () => {
    test('test redirection to 404', () => {
        const { path } = notFoundRedirection;

        // mock the token with to redirect to not found
        window.history.pushState({}, 'test page', '/?token=');
        const navigate = jest.fn();
        jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <ReduxProvider>
                <VerifyUser />
            </ReduxProvider>
        );

        // redirect to /404
        expect(navigate).toHaveBeenCalledWith(path);
    });

    test('test invalid token', () => {
        const { token, screenText, toastMessage } = invalidToken;

        // mock url with invalid token
        window.history.pushState({}, 'test page', `/?token=${token}`);
        jest.spyOn(toast, 'error');
        render(
            <ReduxProvider>
                <VerifyUser />
            </ReduxProvider>
        );

        // element with Welcome !! text not found and error toast popped up
        expect(screen.queryByText(screenText)).not.toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(toastMessage));
    });

    test('test valid token and api failure', async () => {
        const { toastMessage, token, errorMessage } = apiFailure;

        // mock the url with valid token
        window.history.pushState({}, 'test page', `/?token=${encodeURIComponent(token)}`);
        jest.spyOn(toast, 'error');
        jest.spyOn(apiClient, 'api').mockRejectedValue(new Error(errorMessage));

        render(
            <ReduxProvider>
                <VerifyUser />
            </ReduxProvider>
        );

        // expect the api is failed
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(toastMessage);
        });
    });

    test('test valid token and api success', async () => {
        const { screenText, toastMessage, token, bearerToken, path } = apiSuccess;

        // mock the url with valid token
        window.history.pushState({}, 'test page', `/?token=${encodeURIComponent(token)}`);
        jest.spyOn(toast, 'success');
        jest.spyOn(apiClient, 'api').mockResolvedValue({ token: bearerToken });
        const navigate = jest.fn();
        jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <ReduxProvider>
                <VerifyUser />
            </ReduxProvider>
        );
        // on api success render the screen and token is set in localstorage
        await waitFor(async () => {
            expect(screen.getByText(screenText)).toBeInTheDocument();
            expect(localStorage.setItem).toHaveBeenCalledWith('token', bearerToken);
        });

        // success message on toast and navigate to dashboard
        expect(toast.success).toHaveBeenCalledWith(toastMessage);
        expect(navigate).toHaveBeenCalledWith(path);
    });
});
