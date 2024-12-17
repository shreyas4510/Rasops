import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('debug', 'Saving hotel data:', { payload });
        return await db.hotel.create(payload);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while saving hotel data', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const update = async (options, data) => {
    try {
        logger('debug', 'Updating hotel data with options:', { options }, 'and data:', { data });
        return await db.hotel.update(data, { where: options });
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while updating hotel data', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const remove = async (options) => {
    try {
        logger('debug', 'Removing hotel data with options:', { options });
        return await db.hotel.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while removing hotel data', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options) => {
    try {
        logger('debug', 'Get hotel details: ', { options });
        return await db.hotel.findOne(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while fetching hotel data', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const findAll = async (options) => {
    try {
        logger('info', `fetching all hotels with options`, options);
        return await db.hotel.findAndCountAll(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching all hotels`, { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

export default {
    save,
    update,
    remove,
    find,
    findAll
};
