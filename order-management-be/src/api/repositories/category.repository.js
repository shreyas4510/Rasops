import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('info', `Saving category for menu ${JSON.stringify(payload)}`);
        return await db.categories.create(payload);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while saving category: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options) => {
    try {
        logger('debug', 'Fetching category for menu in the database');
        return await db.categories.findAndCountAll(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching categories: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const update = async (options, data) => {
    try {
        logger('debug', 'Updating hotel category with options:', { options }, 'and data:', { data });
        return await db.categories.update(data, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while updating hotel categories', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const remove = async (options) => {
    try {
        logger('debug', 'Removing hotel category with options:', { options });
        return await db.categories.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while removing hotel categories', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, find, update, remove };
