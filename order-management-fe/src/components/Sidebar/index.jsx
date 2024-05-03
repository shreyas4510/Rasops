import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdSettings, IoMdArrowRoundForward } from "react-icons/io";
import { MdOutlineDashboardCustomize, MdOutlineRestaurantMenu, MdOutlineAttachMoney } from "react-icons/md";
import { FcInvite } from "react-icons/fc";
import { PiArmchairFill } from "react-icons/pi";
import { RiHotelFill } from "react-icons/ri";

import Logo from "../../assets/images/omt.png";
import "../../assets/styles/sidebar.css";

function Sidebar() {
    const [active, setActive] = useState(0);
    const [compress, setCompress] = useState(false);
    const navigate = useNavigate();

    const tabs = [
        {
            id: "dashboard",
            Icon: MdOutlineDashboardCustomize,
            title: "Dashboard",
            path: "/dashboard",
        },
        {
            id: "menu",
            Icon: MdOutlineRestaurantMenu,
            title: "Menu",
            path: "/menu",
        },
        {
            id: "tables",
            Icon: PiArmchairFill,
            title: "Tables",
            path: "/tables",
        },
        {
            id: "orders",
            Icon: MdOutlineAttachMoney,
            title: "Orders",
            path: "/orders",
        },
        {
            id: "invites",
            Icon: FcInvite,
            title: "Invites",
            path: "/invites",
        },
        {
            id: "hotels",
            Icon: RiHotelFill,
            title: "Hotels",
            path: "/hotels",
        },
        {
            id: "settings",
            Icon: IoMdSettings,
            title: "Settings",
            path: "/settings",
        },
    ];

    const handleClick = (item) => {
        setActive(item.id);
        navigate(item.path);
    };

    return (
        <>
            <div data-testid="sidebar-testId" className={`otm-sidebar ${compress ? "compressed-sidebar" : "full-sidebar"}`}>
                <div className={`d-flex my-4 align-items-center ${compress ? "flex-column" : "flex-row"}`}>
                    <div className={`d-flex align-items-center justify-content-center w-100 ${compress ? "order-2" : "order-1"}`}>
                        <img src={Logo} height={60} className={compress ? "mt-2" : "m-0"} />
                        <h3 className={`text-white m-0 ${compress && "d-none"}`}>OMT</h3>
                    </div>
                    <div
                        className={`arrow ${compress ? "arrow-compress order-1" : "arrow-full order-2"}`}
                        onClick={() => {
                            setCompress(!compress);
                        }}
                    >
                        {compress ? (
                            <IoMdArrowRoundForward data-testid="arrow-forward" size={20} color="white" className="m-auto" />
                        ) : (
                            <IoMdArrowRoundBack data-testid="arrow-back" size={20} color="white" className="m-auto" />
                        )}
                    </div>
                </div>
                <ul className="p-0">
                    {tabs.map((item) => {
                        const { Icon, title, id } = item;
                        return (
                            <li
                                key={`${title}-${id}`}
                                data-testid={`test-${id}`}
                                onClick={() => handleClick(item)}
                                className={`d-flex align-items-center container ${id === active && "active"}`}
                            >
                                <Icon size={25} className={`${compress ? "m-0" : "ms-4"}`} />
                                <h6 className={`m-0 mx-auto ${compress ? "d-none" : "d-block"}`}>{title}</h6>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={`main-container ${compress ? "main-container-compress" : "main-container-full"}`}>
                <Outlet />
            </div>
        </>
    );
}

export default Sidebar;
