import Joi from "joi";
import { CustomError } from "../utils/common.js";

export const registerationValidation = ( payload ) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).required(),
            address: Joi.string().min(10).required(),
            admin: Joi.array().items(Joi.string()).optional(),
            care_number: Joi.number().min(10 ** 9).max(10 ** 10 - 1).required(),
            open_time: Joi.string().optional(),
            close_time: Joi.string().optional()
        });
        return schema.validate(payload);
    } catch (error) {
        console.log(`Error in validating hotel registeration ${error.message}`);
        throw CustomError(error.code, error.message);
    }
}

export const updateValidation = ( payload ) => {
    try {
        const schema = Joi.object({
            open_time: Joi.string().optional(),
            close_time: Joi.string().optional(),
            name: Joi.string().min(3).optional(),
            care_number: Joi.number().min(10 ** 9).max(10 ** 10 - 1),
            address: Joi.string().min(10),
        }).or( 'open_time', 'close_time', 'name', 'care_number', 'address' );
        return schema.validate(payload);
    } catch (error) {
        console.log(`Error in validating hotel update ${error.message}`);
        throw CustomError(error.code, error.message);
    }
}
