import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('debug', `Customer registeration data`, payload);
        return await db.customer.create(payload);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error while registering customer`, { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

export default {
    save
};
