import CryptoJS from 'crypto-js';
import { STATUS_CODE } from '../utils/common.js';
import {
    emailValidation,
    loginValidation,
    passValidation,
    registrationValidation
} from '../validations/user.validations.js';
import userService from '../services/user.service.js';
import env from '../../config/env.js';
import logger from '../../config/logger.js';

const create = async (req, res) => {
    try {
        const { body } = req;

        logger('debug', { message: 'Received request body', data: body });
        // decrypt and verify the password
        const depass = CryptoJS.AES.decrypt(body.password, env.cryptoSecret).toString(CryptoJS.enc.Utf8);
        const valid = registrationValidation({ ...body, password: depass });
        if (valid.error) {
            logger('error', { message: 'Validation error', error: valid.error.message });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        // register the user with details
        const result = await userService.create(body);
        logger('info', { message: 'User created successfully', data: result });

        return res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        logger('error', { message: 'Error in user registration', error });
        return res.status(error.code).send({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { body } = req;
        logger('info', 'Received login request.', { data: body });

        // decrypt and verify the password
        const depass = CryptoJS.AES.decrypt(body.password, env.cryptoSecret).toString(CryptoJS.enc.Utf8);
        const valid = loginValidation({ ...body, password: depass });
        if (valid.error) {
            logger('error', `Login validation failed: ${valid.error.message}`);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const result = await userService.login({ ...body, password: depass });
        logger('info', 'Login successful.');

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during login: ${error.message}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const verify = async (req, res) => {
    try {
        const { body } = req;
        logger('debug', 'Received verification request with data:', { data: body });

        const result = await userService.verify(body);
        logger('info', 'User verification successful.');

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during user verification: ${error.message}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const forget = async (req, res) => {
    try {
        const { body } = req;
        logger('debug', 'Received forgot password request with data:', { data: body });

        const result = await userService.forget(body);
        logger('info', 'Forgot password successfully.');

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during forgot password: ${error.message}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const reset = async (req, res) => {
    try {
        const { body } = req;
        logger('debug', 'Received password reset request with data:', { data: body });

        const depass = CryptoJS.AES.decrypt(body.newPassword, env.cryptoSecret).toString(CryptoJS.enc.Utf8);
        const valid = passValidation({ password: depass });
        if (valid.error) {
            logger('error', `Invalid new password provided: ${valid.error.message}`);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const result = await userService.reset(body);
        logger('info', 'Password reset successfully.');

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during password reset: ${error.message}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const invite = async (req, res) => {
    try {
        const { body } = req;
        const valid = emailValidation(body);
        if (valid.error) {
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const data = {
            ...body,
            owner: req.user.id,
            name: `${req.user.firstName} ${req.user.lastName}`
        };
        const result = await userService.invite(data);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        // TODO: Add loggers
        // console.log(`Failed to invite ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const listInvites = async (req, res) => {
    try {
        const { query } = req;
        const { limit, skip, sort_key, sort_order, filter_key, filter_value } = query;

        const payload = {
            limit,
            skip,
            sort_key,
            sort_order,
            filter_key,
            filter_value,
            owner: req.user.id
        };

        const result = await userService.listInvites(payload);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        // TODO: Add loggers
        // console.log(`Failed to get invite list ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const removeInvite = async (req, res) => {
    try {
        const id = req.body.id;

        const result = await userService.removeInvite(id);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        // TODO: Add loggers
        // console.log(`Failed to remove invite ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    create,
    login,
    verify,
    forget,
    reset,
    invite,
    listInvites,
    removeInvite
};
