import Joi from 'joi';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

export const updateManagerValidation = (payload) => {
    try {
        const schema = Joi.object({
            prev: Joi.string().optional(),
            current: Joi.string().required()
        }).or('prev', 'current');
        return schema.validate(payload);
    } catch (error) {
        logger('error', 'Error in update manager validation', { error });
        throw CustomError(error.code, error.message);
    }
};
