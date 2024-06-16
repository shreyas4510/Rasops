import Joi from 'joi';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

export const subscribeValidation = (payload) => {
    try {
        const schema = Joi.object({
            endpoint: Joi.string().uri().required(),
            expirationTime: Joi.date().allow(null),
            keys: Joi.object({
                p256dh: Joi.string().required(),
                auth: Joi.string().required()
            }).required()
        });
        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error in validating subscribe notification ${error}`);
        throw CustomError(error.code, error.message);
    }
};
