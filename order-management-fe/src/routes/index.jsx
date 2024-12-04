import React from 'react';
import { Routes as Switch, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgetPassword';
import Hotels from '../pages/Hotels';
import Invites from '../pages/Invites';
import Login from '../pages/Login';
import Managers from '../pages/Managers';
import Menu from '../pages/Menu';
import OrderPlacement from '../pages/OrderPlacement';
import Orders from '../pages/Orders';
import ResetPassword from '../pages/ResetPassword';
import Settings from '../pages/Settings';
import Signup from '../pages/Signup';
import Subscription from '../pages/Subscription';
import Tables from '../pages/Tables';
import VerifyUser from '../pages/VerifyUser';
import AuthRoutes from './AuthRoutes';
import PublicRoutes from './PublicRoutes';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" element={<PublicRoutes />}>
                    <Route path="" element={<Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="verify" element={<VerifyUser />} />
                    <Route path="reset" element={<ResetPassword />} />
                    <Route path="place/:token" element={<OrderPlacement />} />
                </Route>
                <Route path="/" element={<AuthRoutes />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="invites" element={<Invites />} />
                    <Route path="hotels" element={<Hotels />} />
                    <Route path="manager" element={<Managers />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="tables" element={<Tables />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="subscription" element={<Subscription />} />
                </Route>
                <Route path="/404" element={<>Not Found</>} />
                <Route path="*" element={<Navigate to="/404" />} />
            </Switch>
        </BrowserRouter>
    );
}
