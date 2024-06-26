import logger from '../../config/logger.js';
import checkoutService from '../services/checkout.service.js';
import { STATUS_CODE } from '../utils/common.js';
import {
    accountDetailsValidation,
    businessDetailsValidation,
    stakeholderDetailsValidation,
    subscribeSuccessValidation,
    subscribeValidation
} from '../validations/checkout.validations.js';

const business = async (req, res) => {
    try {
        const payload = req.body;
        const userId = req.user.id;
        logger('debug', 'Add business details request', { userId, payload });

        const validation = businessDetailsValidation(payload);
        if (validation.error) {
            logger('error', 'Business validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await checkoutService.business(userId, payload);
        return res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        logger('error', 'Error occurred during bussiness registration', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const stakeholder = async (req, res) => {
    try {
        const payload = req.body;
        const userId = req.user.id;
        logger('debug', 'Add stakeholder details request', { userId, payload });

        const validation = stakeholderDetailsValidation(payload);
        if (validation.error) {
            logger('error', 'Stakeholder validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await checkoutService.stakeholder(userId, payload);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred during stakeholder registration', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const account = async (req, res) => {
    try {
        const payload = req.body;
        const userId = req.user.id;
        logger('debug', 'Add bank details request', { userId, payload });

        const validation = accountDetailsValidation(payload);
        if (validation.error) {
            logger('error', 'Bank validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await checkoutService.account(userId, payload.token);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred during bank registration', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const subscribe = async (req, res) => {
    try {
        const payload = req.body;

        const validation = subscribeValidation(payload);
        if (validation.error) {
            logger('error', 'Subscribe validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await checkoutService.subscribe(payload);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred during subscription', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const success = async (req, res) => {
    try {
        const payload = req.body;
        const userId = req.user.id;
        logger('debug', 'Subscription success request', payload);

        const validation = subscribeSuccessValidation(payload);
        if (validation.error) {
            logger('error', 'Subscription success validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await checkoutService.success(userId, payload);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred in subscription success', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    business,
    stakeholder,
    account,
    subscribe,
    success
};
