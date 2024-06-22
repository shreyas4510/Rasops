import { Routes as Switch, Route, BrowserRouter, Navigate } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import AuthRoutes from './AuthRoutes';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgetPassword';
import VerifyUser from '../pages/VerifyUser';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Invites from '../pages/Invites';
import Hotels from '../pages/Hotels';
import Managers from '../pages/Managers';
import Settings from '../pages/Settings';
import Menu from '../pages/Menu';
import Orders from '../pages/Orders';
import Tables from '../pages/Tables';
import OrderPlacement from '../pages/OrderPlacement';
import Subscription from '../pages/Subscription';
import FullRoutes from './FullRoutes';

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
                <Route path="/" element={<FullRoutes />}>
                    <Route path="subscription/:hotelId" element={<Subscription />} />
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
                </Route>
                <Route path="/404" element={<>Not Found</>} />
                <Route path="*" element={<Navigate to="/404" />} />
            </Switch>
        </BrowserRouter>
    );
}
