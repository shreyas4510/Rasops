import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OTMModal from '../../../components/Modal';
import { closebtn, description, submitbtn, title } from '../../utils/components/dummy.modal';

const testFn = jest.fn();

describe('test otm modal component', () => {
    test('test rendering of otm modal', async () => {
        // Rendering the OTMModal component with provided props
        await act(async () => {
            render(
                <OTMModal
                    title={title}
                    description={description}
                    show={true}
                    handleClose={testFn}
                    handleSubmit={testFn}
                    closeText={closebtn}
                    submitText={submitbtn}
                />
            );
        });

        // Verifying if the title is rendered correctly
        const modalTitle = screen.getByText(title);
        expect(modalTitle).toBeInTheDocument();

        // Verifying if the description is rendered correctly
        const modalBody = screen.getByText(description);
        expect(modalBody).toBeInTheDocument();

        // Verifying if the close button is rendered correctly and simulating a click event
        const closeBtn = screen.getByText(closebtn);
        expect(closeBtn).toBeInTheDocument();
        await act(async () => {
            userEvent.click(closeBtn);
            expect(testFn).toHaveBeenCalledTimes(1); // Checking if the handleClose function is called once upon clicking the close button
        });

        // Verifying if the submit button is rendered correctly and simulating a click event
        const submitBtn = screen.getByText(submitbtn);
        await act(async () => {
            userEvent.click(submitBtn);
            expect(testFn).toHaveBeenCalledTimes(2); // Checking if the handleSubmit function is called once upon clicking the submit button
        });
    });
});
