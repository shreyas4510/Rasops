import { Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

function AuthRoutes() {
    const token = localStorage.getItem('token');
    return token ? (
        <>
            <Navbar />
            <Sidebar />
        </>
    ) : (
        <Navigate to="/" replace />
    );
}

export default AuthRoutes;
