import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { VERIFICATION_ROUTE } from '../../utils/constants';

function PublicRoutes() {
    const token = localStorage.getItem('token');
    const validRedirection = window.location.href.includes(`${window.location.pathname}?token=`);
    return !token || (VERIFICATION_ROUTE.includes(window.location.pathname) && validRedirection) ? (
        <Outlet />
    ) : (
        <Navigate to="/dashboard" />
    );
}

export default PublicRoutes;
