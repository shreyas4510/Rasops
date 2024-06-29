export const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    GONE: 410,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    TOO_MANY_REQUEST: 429,
    CONFLICT: 409
};

export const EMAIL_ACTIONS = {
    VERIFY_USER: 'verify-user',
    FORGOT_PASSWORD: 'forgot-password',
    INVITE_MANAGER: 'invite-manager',
    CUSTOM_SUBSCRIPTION: 'custom-subscription'
};

export const TABLES = {
    USERS: 'users',
    INVITE: 'invites',
    HOTEL: 'hotels',
    HOTEL_USER_RELATION: 'hotelUserRelations',
    TABLE: 'tables',
    CATEGORIES: 'categories',
    MENU: 'menus',
    PREFERENCES: 'preferences',
    CUSTOMER: 'customers',
    ORDER: 'orders',
    PUSH_SUBSCRIPTION: 'pushSubscriptions',
    NOTIFICATION: 'notifications',
    PAYMENT_GATEWAY_ENTITIES: 'paymentGatewayEntities',
    SUBSCRIPTION: 'subscriptions'
};

export const CustomError = (code = STATUS_CODE.INTERNAL_SERVER_ERROR, message = 'Something went wrong.') => {
    const error = new Error(message);
    error.code = code;
    return error;
};

export const PLANS = {
    BASIC_MONTHLY: 'BASIC-MONTHLY',
    BASIC_YEARLY: 'BASIC-YEARLY',
    STANDARD_MONTHLY: 'STANDARD-MONTHLY',
    STANDARD_YEARLY: 'STANDARD-YEARLY',
    CUSTOM: 'CUSTOM'
};

export const calculateBill = (price) => {
    const sgst = price * (18 / 100);
    const cgst = price * (18 / 100);
    const totalPrice = price + sgst + cgst;

    return { sgst, cgst, totalPrice };
};
