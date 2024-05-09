import Joi from 'joi';
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
		// TODO: add error loggers
		// console.log(`Error in validating hotel registeration ${error.message}`);
		throw CustomError(error.code, error.message);
	}
};

export const updateValidation = (payload) => {
	try {
		const schema = Joi.object({
			openTime: Joi.string().optional(),
			closeTime: Joi.string().optional(),
			name: Joi.string().min(3).optional(),
			careNumber: Joi.number()
				.min(10 ** 9)
				.max(10 ** 10 - 1),
			address: Joi.string().min(10)
		}).or('openTime', 'closeTime', 'name', 'careNumber', 'address');
		return schema.validate(payload);
	} catch (error) {
		// TODO: add error loggers
		// console.log(`Error in validating hotel update ${error.message}`);
		throw CustomError(error.code, error.message);
	}
};
