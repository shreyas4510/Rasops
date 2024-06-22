import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

const save = async (payload) => {
    try {
        logger('info', 'Saving payment gateway entities to the database', { payload });
        return await db.paymentGatewayEntities.create(payload);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while saving payment gateway entities details: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

const find = async (options) => {
    try {
        logger('info', `fetching payment gateway entities with options`, options);
        return await db.paymentGatewayEntities.findOne(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', `Error occurred while fetching payment gateway entities`, { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

const update = async (options, data) => {
    try {
        logger('debug', 'Updating payment gateway entities data with options:', { options }, 'and data:', { data });
        return await db.paymentGatewayEntities.update(data, options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        logger('error', 'Error while updating payment gateway entities data', { error: err || error.message });
        throw CustomError(error.code, err || error.message);
    }
};

export default { save, find, update };
