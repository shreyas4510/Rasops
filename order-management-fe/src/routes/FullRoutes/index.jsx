import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function FullRoutes() {
    const token = localStorage.getItem('token');
    return token ? (
        <>
            <Navbar />
            <Outlet />
        </>
    ) : (
        <Navigate to="/" replace />
    );
}

export default FullRoutes;
