import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import Invites from '../../../pages/Invites';
import * as service from '../../../services/invite.service';
import {
    defaultList,
    defaultRows,
    delRecords,
    invite,
    list,
    noRecordId,
    success
} from '../../utils/pages/dummy.invite';

// Mocking service and toast
jest.mock('../../../services/invite.service');
jest.mock('react-toastify');

// Test suite for Invites page
describe('test invite page', () => {
    beforeEach(() => {
        // Mocking service function to return empty list
        service.list.mockResolvedValue(defaultList);
    });

    // Test for successful invitation
    test('test send invite success', async () => {
        // Mocking service function to resolve with success
        service.inviteUser.mockResolvedValue(invite.message);
        // Rendering Invites component
        render(<Invites />);

        // Checking initial state of send button
        const sendButton = screen.queryByText(invite.btn);
        expect(sendButton).toBeInTheDocument();
        expect(sendButton).toBeDisabled();

        // Typing email into input field
        const emailInput = screen.getByTestId(invite.inputId);
        await act(async () => {
            userEvent.type(emailInput, invite.email);
        });

        // Checking send button state after input
        expect(sendButton).not.toBeDisabled();
        // Clicking send button
        await act(async () => {
            userEvent.click(sendButton);
        });

        // Verifying service function and toast call
        expect(service.inviteUser).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(invite.success);
    });

    // Test for invitation failure
    test('test send invite error', async () => {
        // Mocking service function to reject with error
        service.inviteUser.mockRejectedValue(new Error(invite.err));
        // Rendering Invites component
        render(<Invites />);

        // Checking initial state of send button
        const sendButton = screen.queryByText(invite.btn);
        expect(sendButton).toBeInTheDocument();
        expect(sendButton).toBeDisabled();

        // Typing email into input field
        const emailInput = screen.getByTestId(invite.inputId);
        await act(async () => {
            userEvent.type(emailInput, invite.email);
        });

        // Checking send button state after input
        expect(sendButton).not.toBeDisabled();
        // Clicking send button
        await act(async () => {
            userEvent.click(sendButton);
        });

        // Verifying service function and toast call
        expect(service.inviteUser).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith(invite.failure);
    });

    // Test for no records found
    test('test no records found', async () => {
        await act(async () => {
            // Rendering Invites component
            render(<Invites />);
        });
        // Verifying presence of no records message
        const logo = screen.getByTestId(noRecordId);
        expect(logo).toBeInTheDocument();
    });

    // Test for successful records retrieval
    test('test success records', async () => {
        // Mocking service function to return one record
        service.list.mockResolvedValue(success.res);

        await act(async () => {
            // Rendering Invites component
            render(<Invites />);
        });

        // Verifying absence of no records message
        expect(screen.queryByTestId(noRecordId)).not.toBeInTheDocument();

        // Verifying presence of table and rows
        const table = screen.getByRole('table');
        const rows = screen.getAllByRole('row', { within: table });

        // Verifying number of rows
        const numberOfRows = rows.length - 1;
        expect(numberOfRows).toEqual(defaultRows);
    });

    // Test for error in records retrieval
    test('test get list api error', async () => {
        // Mocking service function to reject with error
        service.list.mockRejectedValue(new Error(list.err));
        await act(async () => {
            // Rendering Invites component
            render(<Invites />);
        });

        // Verifying presence of no records message and toast call
        expect(screen.getByTestId(noRecordId)).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith(list.message);
    });

    // Test for disabled accepted invite feature
    test('test disabled accepted invite feature', async () => {
        // Mocking service function to return two records with different statuses
        service.list.mockResolvedValue(delRecords.data);

        await act(async () => {
            // Rendering Invites component
            render(<Invites />);
        });

        // Verifying presence of table and rows
        const table = screen.getByRole('table');
        const rows = screen.getAllByRole('row', { within: table });

        // Verifying number of rows and delete button states
        const numberOfRows = rows.length - 1;
        expect(numberOfRows).toEqual(defaultRows);
        const del = screen.queryAllByText(delRecords.btn);
        expect(del[0]).not.toBeDisabled();
        expect(del[1]).toBeDisabled();
    });

    // Test for deleting pending record
    test('test deleted pending record', async () => {
        // Mocking service function to return two records with different statuses
        service.list.mockResolvedValue(delRecords.data);
        // Mocking remove function to resolve with success
        service.remove.mockResolvedValue(invite.message);

        await act(async () => {
            // Rendering Invites component
            render(<Invites />);
        });

        // Verifying presence of table and rows
        const table = screen.getByRole('table');
        const rows = screen.getAllByRole('row', { within: table });

        // Verifying number of rows and delete button states
        const numberOfRows = rows.length - 1;
        expect(numberOfRows).toEqual(defaultRows);
        const del = screen.queryAllByText(delRecords.btn);
        expect(del[0]).not.toBeDisabled();
        expect(del[1]).toBeDisabled();

        // Clicking delete button for pending record
        await act(async () => {
            userEvent.click(del[0]);
        });

        // Verifying presence of modal and its content
        const modalBody = document.querySelector(delRecords.modalBody);
        expect(modalBody).toBeInTheDocument();
        expect(modalBody).toContainHTML(delRecords.confirmation);

        const modalFooter = document.querySelector(delRecords.modalFooter);
        expect(modalFooter).toBeInTheDocument();

        const buttonsInModalFooter = modalFooter.querySelectorAll(delRecords.btnRole);
        expect(buttonsInModalFooter.length).toEqual(2);
        expect(buttonsInModalFooter[1]).toContainHTML(delRecords.btn);

        // Clicking delete button in modal
        await act(async () => {
            userEvent.click(buttonsInModalFooter[1]);
        });

        // Verifying service function and toast call
        expect(service.remove).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(delRecords.message);
    });
});
