import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const find = async (options) => {
    try {
        logger('info', `fetching order for customer with options`, options);
        return await db.orders.findAndCountAll(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching orders`, { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const save = async (payload, options = {}) => {
    try {
        logger('info', 'Saving order data to the database', { payload, options });
        return await db.orders.bulkCreate(payload, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while saving order details: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const update = async (options, data) => {
    try {
        logger('debug', 'Updating order data options:', { options }, 'and data:', { data });
        return await db.orders.update(data, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while updating order', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const sum = async (columnName, options) => {
    try {
        logger('debug', 'Finding sum of orders with options:', { options });
        return await db.orders.sum(columnName, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while finding sum of order', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const remove = async (options) => {
    try {
        logger('debug', 'Removing orders from the database');
        return await db.orders.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while removing orders data: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { find, save, update, sum, remove };
