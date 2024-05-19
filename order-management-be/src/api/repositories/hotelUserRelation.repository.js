import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('debug', `Saving hotel user relation data ${JSON.stringify(payload)}`);
        return await db.hotelUserRelation.bulkCreate(payload);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while saving hotel user relation data', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options = {}) => {
    try {
        logger('debug', `Finding hotel user relation data with options ${JSON.stringify(options)}`);
        return await db.hotelUserRelation.findAndCountAll(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while finding hotel user relation data', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const remove = async (options) => {
    try {
        logger('debug', `Removing hotel user relation data with options ${JSON.stringify(options)}`);
        return await db.hotelUserRelation.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while removing hotel user relation data', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

export default {
    save,
    find,
    remove
};
