import React from 'react';
import { act, render, screen } from '@testing-library/react';
import Sidebar from '../../../components/Sidebar';
import RouterDom from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {
    activeClass,
    compressClass,
    compressId,
    dashboardId,
    expandClass,
    expandId,
    path,
    sidebarId
} from '../../utils/components/dummy.sidebar';

// Mocking react-router-dom for testing purposes
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

// Test suite for Sidebar component
describe('test sidebar component', () => {
    // Test to check if the sidebar compresses correctly
    test('test check compress', async () => {
        // Rendering the Sidebar component
        await act(async () => {
            render(<Sidebar />);
        });

        // Getting the compress button and checking if it's in the document
        const compress = screen.getByTestId(compressId);
        expect(compress).toBeInTheDocument();

        // Simulating a click on the compress button
        await act(async () => {
            userEvent.click(compress);
        });

        // Getting the sidebar and checking if it has the compress class
        const sidebar = screen.getByTestId(sidebarId);
        expect(sidebar).toHaveClass(compressClass);
    });

    // Test to check if the sidebar expands correctly
    test('test check expand', async () => {
        // Rendering the Sidebar component
        await act(async () => {
            render(<Sidebar />);
        });

        // Getting the compress button and checking if it's in the document
        const compress = screen.getByTestId(compressId);
        expect(compress).toBeInTheDocument();

        // Simulating a click on the compress button
        await act(async () => {
            userEvent.click(compress);
        });

        // Getting the sidebar and checking if it has the compress class
        const sidebar = screen.getByTestId(sidebarId);
        expect(sidebar).toHaveClass(compressClass);

        // Getting the expand button and checking if it's in the document
        const expand = screen.getByTestId(expandId);
        expect(expand).toBeInTheDocument();

        // Simulating a click on the expand button
        await act(async () => {
            userEvent.click(expand);
        });

        // Checking if the sidebar has the expand class after clicking the expand button
        expect(sidebar).toHaveClass(expandClass);
    });

    // Test to check if an option becomes active upon clicking
    test('test active option', async () => {
        // Mocking the useNavigate function from react-router-dom
        const navigate = jest.fn();
        jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

        // Rendering the Sidebar component
        await act(async () => {
            render(<Sidebar />);
        });

        // Getting the dashboard option and checking if it doesn't have the active class initially
        const option = screen.getByTestId(dashboardId);
        expect(option).not.toHaveClass(activeClass);

        // Simulating a click on the dashboard option
        await act(async () => {
            userEvent.click(option);
        });

        // Checking if the navigate function was called with the correct path and if the option now has the active class
        expect(navigate).toHaveBeenCalledWith(path);
        expect(option).toHaveClass(activeClass);
    });
});
