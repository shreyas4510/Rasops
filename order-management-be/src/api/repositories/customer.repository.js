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

const update = async (options, data) => {
    try {
        logger('debug', 'Updating customer data options:', { options }, 'and data:', { data });
        return await db.customer.update(data, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while updating customer', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options) => {
    try {
        logger('info', `fetching customer with options`, options);
        return await db.customer.findAndCountAll(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching customers`, { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const remove = async (options) => {
    try {
        logger('debug', 'Removing customer from the database');
        return await db.customer.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while removing customer data: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, update, find, remove };
