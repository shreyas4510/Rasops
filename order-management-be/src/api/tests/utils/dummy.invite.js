import { INVITE_STATUS } from '../../models/invite.model.js';
import { STATUS_CODE } from '../../utils/common';

export const create = {
    body: {
        email: 'valid-test@test.com',
        user: {
            id: 'test-owner-id',
            firstName: 'test-owner-firstname',
            lastName: 'test-owner-lastname'
        }
    },
    db: {
        id: 'test-invite-id'
    },
    res: {
        code: STATUS_CODE.OK,
        data: { message: 'Invite link sent' }
    },
    error: {
        code: STATUS_CODE.INTERNAL_SERVER_ERROR
    }
};

export const list = {
    req: { query: {}, user: { id: 'test-user-id' } },
    res: {
        status: STATUS_CODE.OK,
        data: {
            count: 1,
            data: [
                {
                    id: 'test-invite-id'
                }
            ]
        }
    },
    error: {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch invites'
    }
};

export const remove = {
    req: { body: { id: 'test-invite-id' } },
    res: {
        success: {
            status: STATUS_CODE.OK,
            message: 'Invite deleted successfully'
        }
    },
    error: {
        errorInviteUser: {
            status: STATUS_CODE.NOT_FOUND,
            message: 'Invited user not found'
        },
        errorActiveUser: {
            status: STATUS_CODE.BAD_REQUEST,
            message: 'Invited user is active'
        },
        errorInternalUser: {
            status: STATUS_CODE.INTERNAL_SERVER_ERROR,
            message: 'Failed to remove invite'
        }
    },
    db: {
        findAndCountAll: {
            empty: {
                rows: []
            },
            accepted: {
                rows: [{ status: INVITE_STATUS[1] }]
            },
            success: {
                rows: [{ status: INVITE_STATUS[0] }]
            }
        },
        destory: {
            success: 1
        }
    }
};
