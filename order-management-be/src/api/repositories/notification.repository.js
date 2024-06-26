import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('info', `Saving notification for user`, payload);
        return await db.notifications.create(payload);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while saving notification: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options) => {
    try {
        logger('info', `Fetching notification for user`, options);
        return await db.notifications.findAndCountAll(options);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while fetching notification: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const update = async (options, data) => {
    try {
        logger('info', `Updating notification for user`, options);
        return await db.notifications.update(data, options);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while updating notification: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, find, update };
