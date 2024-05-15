// Mocking react-router-dom's useNavigate function
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

describe('test navbar component', () => {
    test('dummy test', () => {});
    // test('test rendering of navbar', async () => {
    //     // Test rendering of navbar
    //     await act(async () => {
    //         render(<Navbars />);
    //     });

    //     // Asserting presence of notification icon
    //     const notificatioIcon = screen.getByTestId(bellIcon);
    //     expect(notificatioIcon).toBeInTheDocument();

    //     // Asserting presence of navigation options
    //     const options = screen.getByTestId(navOptionsId);
    //     expect(options).toBeInTheDocument();
    // });

    // test('test click on logout', async () => {
    //     // Mocking useNavigate hook
    //     const navigate = jest.fn();
    //     jest.spyOn(RouterDom, 'useNavigate').mockReturnValue(navigate);

    //     // Rendering navbar
    //     await act(async () => {
    //         render(<ReduxProvider><Navbars /></ReduxProvider>);
    //     });

    //     // Asserting presence of notification icon
    //     const notificatioIcon = screen.getByTestId(bellIcon);
    //     expect(notificatioIcon).toBeInTheDocument();

    //     // Asserting presence of user element
    //     const user = screen.getByTestId(navUserId);
    //     expect(user).toBeInTheDocument();

    //     // Clicking on user element to trigger dropdown
    //     await act(async () => {
    //         userEvent.click(user);
    //     });

    //     // Waiting for logout button to appear and clicking on it
    //     await waitFor(() => {
    //         const btn = screen.getByText(logout);
    //         expect(btn).toBeInTheDocument();

    //         userEvent.click(btn);
    //     });

    //     // Expecting navigation to logout path
    //     expect(navigate).toHaveBeenCalledWith(path);

    //     // Restoring mocked functions
    //     jest.restoreAllMocks();
    // });
});
