import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('info', "Saving user data to the database");
        return await db.users.create(payload);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while saving user data: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const findOne = async (payload) => {
    try {
        logger('debug', "Fetching user data in the database");
        return await db.users.findOne({ where: payload });
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while finding user data: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, findOne };
