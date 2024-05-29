import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import User from '../../assets/images/user.png';
import '../../assets/styles/navbar.css';
import CustomButton from '../CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserRequest, setGlobalHotelId } from '../../store/slice';
import CryptoJS from 'crypto-js';
import env from '../../config/env';
import { IoCaretBack } from 'react-icons/io5';
import { USER_ROLES } from '../../utils/auth';

function Navbars() {
    const user = useSelector((state) => state.user.data);
    const dispatch = useDispatch();

    const notifications = 5;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const viewData = JSON.parse(
        CryptoJS.AES.decrypt(localStorage.getItem('data'), env.cryptoSecret).toString(CryptoJS.enc.Utf8)
    );

    useEffect(() => {
        if (!user.id) {
            dispatch(getUserRequest({ navigate }));
        }
        if (viewData.hotelId) {
            console.log('Here');
            navigate('/dashboard');
            dispatch(setGlobalHotelId(viewData.hotelId));
        }
    }, []);

    return (
        <Navbar className="py-1 navbar-container">
            <Nav className="ms-auto d-flex align-items-center">
                {Object.keys(viewData).length > 1 && viewData.role.toUpperCase() === USER_ROLES[0] && (
                    <CustomButton
                        className="switch-button mx-4 d-flex align-items-center fw-bold"
                        onClick={() => {
                            const details = CryptoJS.AES.encrypt(
                                JSON.stringify({ role: user.role }),
                                env.cryptoSecret
                            ).toString();
                            dispatch(setGlobalHotelId(null));
                            localStorage.setItem('data', details);
                            navigate('/hotels');
                        }}
                        label={
                            <>
                                <IoCaretBack size={20} className="me-1" />
                                Owner View
                            </>
                        }
                        disabled={false}
                    />
                )}
                <div data-testid="notification-bell-icon" className="notification-bell">
                    <div className="notification-text">{notifications}</div>
                    <FaBell color="white" size={25} />
                </div>
                <NavDropdown
                    key={1}
                    data-testid="navbar-options"
                    title={
                        <img data-testid="navbar-user" className="p-1 bg-warning user-logo" src={User} alt="user pic" />
                    }
                    drop="down-start"
                    className="hide-dropdown-arrow mx-3 p-0"
                >
                    <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar>
    );
}

export default Navbars;
