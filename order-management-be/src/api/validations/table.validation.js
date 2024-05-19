import Joi from 'joi';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

export const registerValidation = (payload) => {
    try {
        const schema = Joi.object({
            tableNumber: Joi.number().required(),
            hotelId: Joi.string().required()
        });
        return schema.validate(payload);
    } catch (error) {
        logger('error', 'Error in register table validation', { error });
        throw CustomError(error.code, error.message);
    }
};
