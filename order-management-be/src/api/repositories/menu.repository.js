import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('debug', `Saving hotel menu items ${JSON.stringify(payload)}`);
        return await db.menu.bulkCreate(payload);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while saving hotel menu items', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const update = async (options, data) => {
    try {
        logger('debug', 'Updating hotel menu with options:', { options }, 'and data:', { data });
        return await db.menu.update(data, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while updating menu', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const remove = async (options) => {
    try {
        logger('debug', 'Removing hotel menu with options:', { options });
        return await db.menu.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while removing hotel menu', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options) => {
    try {
        logger('debug', 'Fetching menu items in the database');
        return await db.menu.findAndCountAll(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while finding menu items: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const count = async (options) => {
    try {
        logger('debug', 'Fetching menu items count');
        return await db.menu.count(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while finding menu items count: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, update, remove, find, count };
