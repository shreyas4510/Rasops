import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('info', `Saving subscription for hotel`, payload);
        return await db.subscriptions.create(payload);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while saving subscription: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const findOne = async (options) => {
    try {
        logger('debug', 'Fetching subscription by hotel in the database');
        return await db.subscriptions.findOne(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching hotel subscription: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const update = async (options, data) => {
    try {
        logger('debug', 'Updating subscription by hotel in the database', { options, data });
        return await db.subscriptions.update(data, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while updating subscription: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, findOne, update };
