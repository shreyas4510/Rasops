import React from 'react';
import { Provider } from 'react-redux';
import store from "../../../store";

export default ReduxProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);
