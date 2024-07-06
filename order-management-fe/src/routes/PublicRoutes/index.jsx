import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoutes() {
    const token = localStorage.getItem('token');
    return !token ? <Outlet /> : <Navigate to="/dashboard" />;
}

export default PublicRoutes;
