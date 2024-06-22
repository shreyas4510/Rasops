import Joi from 'joi';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

export const businessDetailsValidation = (payload) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
            phone: Joi.number().min(10 ** 9).max(10 ** 10 - 1).required(),
            legalBusinessName: Joi.string().required(),
            businessType: Joi.string().required(),
            profile: Joi.object({
                category: Joi.string().allow(''),
                subcategory: Joi.string().allow(''),
                addresses: Joi.object({
                    registered: Joi.object({
                        street1: Joi.string().allow(''),
                        street2: Joi.string().allow(''),
                        city: Joi.string().allow(''),
                        state: Joi.string().allow(''),
                        postalCode: Joi.string().allow(''),
                        country: Joi.string().allow('')
                    })
                })
            }),
            legalInfo: Joi.object({
                pan: Joi.string().pattern(/^[a-zA-Z]{5}\d{4}[a-zA-Z]{1}$/).required(),
                gst: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9]{1}$/i).required()
            })
        });
        return schema.validate(payload);
    } catch (error) {
        logger('error', 'Error in business validation', { error });
        throw CustomError(error.code, error.message);
    }
}

export const stakeholderDetailsValidation = (payload) => {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            kyc: Joi.object({
                pan: Joi.string()
                    .pattern(/^[a-zA-Z]{5}\d{4}[a-zA-Z]{1}$/)
                    .required()
            }),
            addresses: Joi.object({
                residential: Joi.object({
                    street: Joi.string().allow(''),
                    city: Joi.string().allow(''),
                    state: Joi.string().allow(''),
                    postalCode: Joi.string().allow(''),
                    country: Joi.string().allow('')
                })
            })
        });
        return schema.validate(payload);
    } catch (error) {
        logger('error', 'Error in stakeholder validation', { error });
        throw CustomError(error.code, error.message);
    }
}

export const accountDetailsValidation = (payload) => {
    try {
        const schema = Joi.object({
            token: Joi.string().required()
        });
        return schema.validate(payload);
    } catch (error) {
        logger('error', 'Error in bank validation', { error });
        throw CustomError(error.code, error.message);
    }
}
