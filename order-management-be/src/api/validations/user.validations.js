import Joi from 'joi';
import { CustomError } from '../utils/common.js';

export const registrationValidation = (payload) => {
    try {
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
        throw CustomError(error.code, error.message);
    }
};

export const loginValidation = (payload) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            }),
            password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        });

        return schema.validate(payload);
    } catch (error) {
        // TODO: add error loggers
        throw CustomError(error.code, error.message);
    }
};

export const emailValidation = (payload) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            })
        });

        return schema.validate(payload);
    } catch (error) {
        // TODO: add error loggers
        throw CustomError(error.code, error.message);
    }
};

export const passValidation = (payload) => {
    try {
        const schema = Joi.object({
            password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        });

        return schema.validate(payload);
    } catch (error) {
        // TODO: add error loggers
        throw CustomError(error.code, error.message);
    }
};
