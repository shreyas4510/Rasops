import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('info', 'Saving table data to the database');
        return await db.tables.bulkCreate(payload);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while saving table: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options) => {
    try {
        logger('debug', 'Fetching tables for hotel in the database');
        return await db.tables.findAndCountAll(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching tables: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const remove = async (options) => {
    try {
        logger('debug', 'Removing table for hotel in the database');
        return await db.tables.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while deleting table: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const findOne = async (options) => {
    try {
        logger('debug', 'Fetching table by id in the database');
        return await db.tables.findOne(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching table: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const update = async (options, data) => {
    try {
        logger('debug', 'Updating table by id in the database', { options, data });
        return await db.tables.update(data, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while updating table: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, find, remove, findOne, update };
