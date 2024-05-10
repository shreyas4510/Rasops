import React from 'react';
import { act, render, screen } from '@testing-library/react';
import CustomButton from '../../../components/CustomButton';
import { label } from '../../utils/components/dumy.customButton';

describe('test custom button component', () => {
    // Test rendering of button
    test('test rendering of button', async () => {
        await act(async () => {
            render(<CustomButton label={label} />);
        });
        const button = screen.getByText(label);
        expect(button).toBeInTheDocument();
    });

    // Test disabled button
    test('test disabled button', async () => {
        await act(async () => {
            render(<CustomButton label={label} />);
        });
        const button = screen.getByText(label);
        expect(button).toBeDisabled();
    });

    // Test active button
    test('test active button', async () => {
        await act(async () => {
            render(<CustomButton label={label} disabled={false} />);
        });
        const button = screen.getByText(label);
        expect(button).not.toBeDisabled();
    });
});
