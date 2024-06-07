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
    INVITE_MANAGER: 'invite-manager'
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
    CUSTOMER: 'customer'
};

export const CustomError = (code = STATUS_CODE.INTERNAL_SERVER_ERROR, message = 'Something went wrong.') => {
    const error = new Error(message);
    error.code = code;
    return error;
};
