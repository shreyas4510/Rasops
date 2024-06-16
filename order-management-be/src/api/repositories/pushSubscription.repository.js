import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('info', `Saving push subscription for user`, payload);
        return await db.pushSubscriptions.create(payload);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while saving push subscription: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const remove = async (options) => {
    try {
        logger('debug', 'Removing push subscription for user', options);
        return await db.pushSubscriptions.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while removing push subscription: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options) => {
    try {
        logger('debug', 'Fetching push subscription', options);
        return await db.pushSubscriptions.findOne(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching push subscription: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, remove, find };
