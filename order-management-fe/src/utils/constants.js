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
