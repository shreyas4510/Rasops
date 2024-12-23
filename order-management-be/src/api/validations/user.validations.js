import Joi from 'joi';
import logger from '../../config/logger.js';
import { CustomError } from '../utils/common.js';

export const registrationValidation = (payload) => {
    try {
        logger('debug', 'Validating registration payload');
        const schema = Joi.object({
            firstName: Joi.string().min(3).max(30).required(),
            lastName: Joi.string().min(3).max(30).required(),
            phoneNumber: Joi.number()
                .min(10 ** 9)
                .max(10 ** 10 - 1)
                .required(),
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            }),
            password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
            invite: Joi.string().optional()
        });

        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error occurred during registration validation: ${error}`);
        throw CustomError(error.code, error.message);
    }
};

export const loginValidation = (payload) => {
    try {
        logger('debug', 'Validating login payload');
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            }),
            password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        });

        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error occurred during login validation: ${error}`);
        throw CustomError(error.code, error.message);
    }
};

export const emailValidation = (payload) => {
    try {
        logger('debug', 'Validating email payload');
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            }),
            resend: Joi.string().optional()
        });

        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error occurred during email validation: ${error}`);
        throw CustomError(error.code, error.message);
    }
};

export const passValidation = (payload) => {
    try {
        logger('debug', 'Validating password payload');
        const schema = Joi.object({
            password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        });

        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error occurred during password validation: ${error}`);
        throw CustomError(error.code, error.message);
    }
};

export const updateValidation = (payload) => {
    try {
        logger('debug', `Validating update user payload`);
        const schema = Joi.object({
            firstName: Joi.string().min(3).max(30).optional(),
            lastName: Joi.string().min(3).max(30).optional(),
            password: Joi.string()
                .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
                .optional(),
            preferences: Joi.object({
                notification: Joi.string().optional(),
                payment: Joi.string().optional(),
                orders: Joi.string().optional()
            })
        }).or('firstName', 'lastName', 'password', 'preferences');

        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error occurred during update user validation: ${error}`);
        throw CustomError(error.code, error.message);
    }
};
