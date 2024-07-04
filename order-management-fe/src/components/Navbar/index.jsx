import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import User from '../../assets/images/user.png';
import '../../assets/styles/navbar.css';
import CustomButton from '../CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import {
    getNotificationRequest,
    getUserRequest,
    logoutRequest,
    setGlobalHotelId,
    setNotificationData,
    updateNotificationRequest
} from '../../store/slice';
import CryptoJS from 'crypto-js';
import env from '../../config/env';
import { IoCaretBack } from 'react-icons/io5';
import { USER_ROLES } from '../../utils/constants';

function Navbars() {
    const user = useSelector((state) => state.user.data);
    const { notificationsData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutRequest());
    };

    const viewData = JSON.parse(
        CryptoJS.AES.decrypt(localStorage.getItem('data'), env.cryptoSecret).toString(CryptoJS.enc.Utf8)
    );

    useEffect(() => {
        const handleServiceWorkerMessage = () => {
            dispatch(
                setNotificationData({
                    ...notificationsData,
                    count: notificationsData.count + 1
                })
            );
        };

        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        return () => {
            navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
        };
    }, []);

    useEffect(() => {
        if (!user.id) {
            dispatch(getUserRequest({ navigate }));
        }
        if (viewData.hotelId) {
            dispatch(setGlobalHotelId(viewData.hotelId));
        }
        if (!notificationsData.count) {
            dispatch(getNotificationRequest());
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
                <NavDropdown
                    key={'notification-bell'}
                    data-testid="navbar-options"
                    title={
                        <div
                            onClick={() => {
                                if (!notificationsData.open) {
                                    dispatch(getNotificationRequest());
                                } else {
                                    dispatch(setNotificationData({ ...notificationsData, open: false }));
                                }
                            }}
                        >
                            <div className="notification-text">
                                <span className="m-auto">
                                    {notificationsData.count > 10 ? '10+' : notificationsData.count}
                                </span>
                            </div>
                            <FaBell color="white" size={25} />
                        </div>
                    }
                    drop="down-start"
                    className="hide-dropdown-arrow notification-dropdown p-0"
                >
                    <div className="notification-list">
                        {notificationsData.data.map((notification, index) => (
                            <NavDropdown.Item key={`notification-${index}`}>
                                <h6 style={{ color: '#49ac60' }}>{notification.title}</h6>
                                <p className="my-1">{notification.message}</p>
                            </NavDropdown.Item>
                        ))}
                    </div>
                    {notificationsData.data.length ? (
                        <NavDropdown.Item
                            className="mark-as-read"
                            onClick={() => {
                                dispatch(updateNotificationRequest());
                            }}
                        >
                            Mark as read
                        </NavDropdown.Item>
                    ) : (
                        <></>
                    )}
                </NavDropdown>
                <NavDropdown
                    key={'user-icon'}
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
