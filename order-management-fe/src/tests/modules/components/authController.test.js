import React from 'react';
import { act, render, screen } from '@testing-library/react';
import AuthContainer from '../../../components/AuthContainer';
import { Children, description, title } from '../../utils/components/dummy.authController';

describe('test auth controller component', () => {
    // Test rendering of component
    test('test rendering of component', async () => {
        await act(async () => {
            render(
                <AuthContainer title={title}>
                    <Children />
                </AuthContainer>
            );
        });

        const child = screen.getAllByText(description);
        expect(child.length).toEqual(1);

        const heading = screen.queryByText(title);
        expect(heading).toBeInTheDocument();
    });
});
