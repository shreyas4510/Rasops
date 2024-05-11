import Joi from 'joi';
import { CustomError } from '../utils/common.js';
import logger from '../../config/logger.js';

export const registrationValidation = (payload) => {
    try {
        logger('debug', "Validating registration payload");
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
        logger('debug', "Validating login payload");
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
        logger('debug', "Validating email payload");
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            })
        });

        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error occurred during email validation: ${error}`);
        throw CustomError(error.code, error.message);
    }
};

export const passValidation = (payload) => {
    try {
        logger('debug', "Validating password payload");
        const schema = Joi.object({
            password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        });

        return schema.validate(payload);
    } catch (error) {
        logger('error', `Error occurred during password validation: ${error}`);
        throw CustomError(error.code, error.message);
    }
};
