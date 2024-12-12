import { BsEnvelopePlusFill } from 'react-icons/bs';
import { FaUserTie } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { MdOutlineDashboardCustomize, MdOutlineRestaurantMenu, MdOutlineAttachMoney } from 'react-icons/md';
import { PiArmchairFill } from 'react-icons/pi';
import { RiHotelFill } from 'react-icons/ri';

export const USER_ROLES = ['OWNER', 'MANAGER'];
export const MENU_STATUS = ['AVAILABLE', 'UNAVAILABLE'];
export const ORDER_STATUS = ['PENDING', 'CANCELLED', 'SERVED'];
export const TABLE_STATUS = ['OPEN', 'BOOKED'];
export const BUSINESS_TYPES = ['public_limited', 'private_limited'];
export const BUSINESS_CATEGORIES = ['food'];
export const BUSINESS_SUB_CATEGORIES = ['restaurant', 'food_court', 'catering'];
export const PAYMENT_PREFERENCE = {
    business: 'BUSINESS',
    stakeholder: 'STAKEHOLDER',
    bank: 'BANK',
    on: 'ON',
    off: 'OFF'
};

export const NOTIFICATION_PREFERENCE = {
    on: 'ON',
    off: 'OFF'
};

export const ORDER_PREFERENCE = {
    on: 'ON',
    off: 'OFF'
};

export const NOTIFICATION_ACTIONS = {
    CUSTOMER_REGISTERATION: 'customer-registeration',
    ORDER_PLACEMENT: 'order-placement',
    ORDER_SERVED: 'order-served',
    PAYMENT_REQUEST: 'payment-request',
    MANUAL_PAYMENT_CONFIRMED: 'manual-payment-confirmed',
    ONLINE_PAYMENT_CONFIRMED: 'online-payment-confirmed'
};

export const OWNER_TABS = [
    {
        order: 2,
        id: 'hotels',
        Icon: RiHotelFill,
        title: 'Hotels',
        path: '/hotels'
    },
    {
        order: 3,
        id: 'invites',
        Icon: BsEnvelopePlusFill,
        title: 'Invites',
        path: '/invites'
    },
    {
        order: 4,
        id: 'manager',
        Icon: FaUserTie,
        title: 'Managers',
        path: '/manager'
    }
];

export const MANAGER_TABS = [
    {
        order: 1,
        id: 'dashboard',
        Icon: MdOutlineDashboardCustomize,
        title: 'Dashboard',
        path: '/dashboard'
    },
    {
        order: 5,
        id: 'menu',
        Icon: MdOutlineRestaurantMenu,
        title: 'Menu',
        path: '/menu'
    },
    {
        order: 6,
        id: 'tables',
        Icon: PiArmchairFill,
        title: 'Tables',
        path: '/tables'
    },
    {
        order: 7,
        id: 'orders',
        Icon: MdOutlineAttachMoney,
        title: 'Orders',
        path: '/orders'
    }
];

export const COMMON_TABS = [
    {
        order: 8,
        id: 'settings',
        Icon: IoMdSettings,
        title: 'Settings',
        path: '/settings'
    }
];

export const VERIFICATION_ROUTE = ['/verify', '/reset', '/signup'];

export const FIELD_CLASS = 'col-md-6 col-12 my-2';
