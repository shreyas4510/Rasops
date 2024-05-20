import Joi from 'joi';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

export const createCategoryValidation = (payload) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            hotelId: Joi.string().required(),
            order: Joi.number()
        });
        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error in creating menu category ${error}`);
        throw CustomError(error.code, error.message);
    }
};

export const updateCategoryValidation = (payload) => {
    try {
        const schema = Joi.object({
            name: Joi.string().optional(),
            order: Joi.number().optional()
        }).or('name', 'order');
        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error in updating menu category ${error}`);
        throw CustomError(error.code, error.message);
    }
};
