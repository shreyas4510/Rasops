import { USER_ROLES } from '../../models/user.model';
import { STATUS_CODE } from '../../utils/common';

export const create = {
    validationTest: {
        req: {
            user: {},
            body: {
                name: 'test-hotel',
                address: 'test hotel address'
            }
        },
        res: {
            status: STATUS_CODE.BAD_REQUEST,
            data: { message: '"careNumber" is required' }
        }
    },
    tooManyRequest: {
        req: {
            user: { id: 'test-owner-id' },
            body: {
                name: 'test-hotel',
                address: 'test hotel address',
                careNumber: '1234567890'
            }
        },
        db: {
            data: { count: 10 }
        },
        response: {
            status: STATUS_CODE.TOO_MANY_REQUEST,
            data: {
                message: `You've reached the maximum limit for hotel creations. Only 10 hotels per user allowed.`
            }
        }
    },
    ownerTest: {
        req: {
            user: { id: 'test-owner-id' },
            body: {
                name: 'test-hotel',
                address: 'test hotel address',
                careNumber: '1234567890'
            }
        },
        db: {
            hotel: {
                id: 'test-hotel-id'
            }
        },
        res: {
            status: STATUS_CODE.CREATED
        }
    },
    managerTest: {
        req: {
            user: { id: 'test-owner-id' },
            body: {
                name: 'test-hotel',
                address: 'test hotel address',
                careNumber: '1234567890',
                manager: ['test-manager-id']
            }
        },
        db: {
            hotel: { id: 'test-hotel-id' },
            manager: { role: USER_ROLES[1] }
        },
        res: {
            status: STATUS_CODE.CREATED
        }
    },
    errorTest: {
        req: {
            user: { id: 'test-owner-id' },
            body: {
                name: 'test-hotel',
                address: 'test hotel address',
                careNumber: '1234567890'
            }
        },
        error: new Error('Internal Server Error'),
        res: {
            status: STATUS_CODE.INTERNAL_SERVER_ERROR,
            data: { message: 'Internal Server Error' }
        }
    }
};

export const update = {
    success: {
        req: {
            params: { id: 'test-hotel-id' },
            body: {
                openTime: '10:00 AM',
                closeTime: '11:00 PM'
            }
        },
        res: {
            status: STATUS_CODE.OK,
            data: { message: 'Success' }
        }
    },
    error: {
        req: {
            params: { id: 'test-hotel-id' },
            body: {
                openTime: '10:00 AM',
                closeTime: '11:00 PM'
            }
        },
        error: 'test error',
        res: {
            status: STATUS_CODE.INTERNAL_SERVER_ERROR,
            data: { message: 'test error' }
        }
    }
};

export const list = {
    success: {
        req: {
            user: { id: 'test-user-id' }
        },
        db: {
            data: {
                count: 2,
                rows: [{ hotel: { id: 'test-hotel-id-1' } }, { hotel: { id: 'test-hotel-id-2' } }]
            }
        },
        res: {
            status: STATUS_CODE.OK,
            data: {
                count: 2,
                rows: [{ id: 'test-hotel-id-1' }, { id: 'test-hotel-id-2' }]
            }
        }
    },
    error: {
        req: {
            user: { id: 'test-user-id' }
        },
        error: 'Failed to fetch',
        res: {
            status: STATUS_CODE.INTERNAL_SERVER_ERROR,
            data: { message: 'Failed to fetch' }
        }
    }
};

export const remove = {
    success: {
        db: {},
        req: {
            params: { id: 'test-hotel-id' }
        },
        response: {
            status: STATUS_CODE.OK,
            data: {
                message: 'Hotel, Managers and Owners removed successfully'
            }
        }
    },
    error: {
        error: 'Failed to delete hotel',
        req: {
            params: { id: 'test-hotel-id' }
        },
        response: {
            status: 500,
            data: {
                message: 'Failed to delete hotel'
            }
        }
    }
};
