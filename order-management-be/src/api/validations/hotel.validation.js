import Joi from 'joi';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

export const registerationValidation = (payload) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).required(),
            address: Joi.string().min(10).required(),
            manager: Joi.array().items(Joi.string()).optional(),
            careNumber: Joi.number()
                .min(10 ** 9)
                .max(10 ** 10 - 1)
                .required(),
            openTime: Joi.string().optional(),
            closeTime: Joi.string().optional()
        });
        return schema.validate(payload);
    } catch (error) {
        logger('error', 'Error in registration validation', { error });
        throw CustomError(error.code, error.message);
    }
};

export const updateValidation = (payload) => {
    try {
        const schema = Joi.object({
            openTime: Joi.string().allow('').optional(),
            closeTime: Joi.string().allow('').optional(),
            name: Joi.string().min(3).optional(),
            careNumber: Joi.number()
                .min(10 ** 9)
                .max(10 ** 10 - 1),
            address: Joi.string().min(10),
            manager: Joi.object({
                added: Joi.array().items(Joi.string()),
                removed: Joi.array().items(Joi.string())
            }).optional()
        }).or('openTime', 'closeTime', 'name', 'careNumber', 'address', 'manager');
        return schema.validate(payload);
    } catch (error) {
        logger('error', 'Error in update validation', { error });
        throw CustomError(error.code, error.message);
    }
};
