import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../assets/images/rasops.png';
import '../../assets/styles/sidebar.css';
import env from '../../config/env';
import { logoutRequest } from '../../store/slice';
import { USER_ROLES, COMMON_TABS, MANAGER_TABS, OWNER_TABS } from '../../utils/constants';
import Loader from '../Loader';
import NoHotel from '../NoHotel';

function Sidebar() {
    const [compress, setCompress] = useState(false);
    const user = useSelector((state) => state.user?.data);
    const globalHotelId = useSelector((state) => state.hotel?.globalHotelId);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleClick = (item) => {
        navigate(item.path);
    };

    let tabs = [];
    try {
        const viewData = JSON.parse(
            CryptoJS.AES.decrypt(localStorage.getItem('data'), env.cryptoSecret).toString(CryptoJS.enc.Utf8)
        );
        tabs =
            Object.keys(viewData).length === 1 && viewData.role.toUpperCase() === USER_ROLES[0]
                ? [...OWNER_TABS, ...COMMON_TABS].sort((a, b) => a.order - b.order)
                : [...MANAGER_TABS, ...COMMON_TABS].sort((a, b) => a.order - b.order);
    } catch (error) {
        toast.error('Oops! Something went wrong. Please try logging in again.');
        dispatch(logoutRequest());
    }

    const render = () => {
        if (Object.keys(user).length && user.role.toUpperCase() === USER_ROLES[0]) {
            return <Outlet />;
        } else if (Object.keys(user).length && user.role.toUpperCase() === USER_ROLES[1]) {
            if (!globalHotelId && [...MANAGER_TABS].find((obj) => obj.path === location.pathname)) {
                return <NoHotel />;
            } else if ([...MANAGER_TABS, ...COMMON_TABS].find((obj) => obj.path === location.pathname)) {
                return <Outlet />;
            } else {
                <Loader />;
            }
        }
        return <></>;
    };

    return (
        <>
            <div
                data-testid="sidebar-testId"
                className={`otm-sidebar ${compress ? 'compressed-sidebar' : 'full-sidebar'}`}
            >
                <div className={`d-flex my-4 align-items-center ${compress ? 'flex-column' : 'flex-row'}`}>
                    <div
                        className={`d-flex align-items-center justify-content-center w-100 ${compress ? 'order-2' : 'order-1'}`}
                    >
                        <h3 className={`text-white m-0 ${compress && 'd-none'}`}>Ras</h3>
                        <img src={Logo} height={40} className={compress ? 'mt-2' : 'mx-1'} />
                        <h3 className={`text-white m-0 ${compress && 'd-none'}`}>ps</h3>
                    </div>
                    <div
                        className={`arrow ${compress ? 'arrow-compress order-1' : 'arrow-full order-2'}`}
                        onClick={() => {
                            setCompress(!compress);
                        }}
                    >
                        {compress ? (
                            <IoMdArrowRoundForward
                                data-testid="arrow-forward"
                                size={20}
                                color="white"
                                className="m-auto"
                            />
                        ) : (
                            <IoMdArrowRoundBack data-testid="arrow-back" size={20} color="white" className="m-auto" />
                        )}
                    </div>
                </div>
                <ul className="p-0">
                    {tabs.map((item) => {
                        const { Icon, title, id, path } = item;
                        return (
                            <OverlayTrigger
                                key={`${title}-${id}`}
                                overlay={compress ? <Tooltip id={id}>{title}</Tooltip> : <></>}
                                placement="right"
                                delayShow={300}
                                delayHide={150}
                            >
                                <li
                                    data-testid={`test-${id}`}
                                    onClick={() => handleClick(item)}
                                    className={`d-flex align-items-center container ${window.location.pathname === path && 'active'}`}
                                >
                                    <Icon size={25} className={`${compress ? 'm-0' : 'ms-4'}`} />
                                    <h6 className={`m-0 mx-auto ${compress ? 'd-none' : 'd-block'}`}>{title}</h6>
                                </li>
                            </OverlayTrigger>
                        );
                    })}
                </ul>
            </div>
            <div className={`main-container ${compress ? 'main-container-compress' : 'main-container-full'}`}>
                {render()}
            </div>
        </>
    );
}

export default Sidebar;
