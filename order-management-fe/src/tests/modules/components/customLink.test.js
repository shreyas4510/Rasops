import React from 'react';
import { act, render, screen } from '@testing-library/react';
import CustomLink from '../../../components/CustomLink';
import { text } from '../../utils/components/dummy.customLink';

describe('test custom link component', () => {
    test('test rendering of custom link component', async () => {
    // This test case checks the rendering of the CustomLink component with custom text.
        await act(async () => {
            render(<CustomLink text={text} />);
        });

        const linkElement = screen.getByText(text);
        expect(linkElement).toBeInTheDocument();
    });
});
