import { USER_ROLES } from "../../models/user.model"
import { STATUS_CODE } from "../../utils/common"

export const create = {
    validationTest: {
        req: {
            user: {},
            body: {
                "name": "test-hotel",
                "address": "test hotel address",
            }
        },
        res: {
            status: STATUS_CODE.BAD_REQUEST,
            data: { "message": "\"care_number\" is required" }
        }
    },
    ownerTest: {
        req: {
            user: { id: 'test-owner-id' },
            body: {
                "name": "test-hotel",
                "address": "test hotel address",
                "care_number": "1234567890"
            }
        },
        db: {
            hotel: {
                id: 'test-hotel-id'
            }
        },
        res: {
            status: STATUS_CODE.CREATED,
        }
    },
    adminTest: {
        req: {
            user: { id: 'test-owner-id' },
            body: {
                "name": "test-hotel",
                "address": "test hotel address",
                "care_number": "1234567890",
                "admin": "test-admin-id"
            }
        },
        db: {
            hotel: { id: 'test-hotel-id' },
            admin: { role: USER_ROLES[1] }
        },
        res: {
            status: STATUS_CODE.CREATED,
        }
    },
    errorTest: {
        req: {
            user: { id: 'test-owner-id' },
            body: {
                "name": "test-hotel",
                "address": "test hotel address",
                "care_number": "1234567890"
            }
        },
        error: new Error('Internal Server Error'),
        res: {
            status: STATUS_CODE.INTERNAL_SERVER_ERROR,
            data: { "message": "Internal Server Error" }
        }
    }
}
export default {
    create
}
