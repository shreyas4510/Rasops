import logger from '../../config/logger.js';
import notificationService from '../services/notification.service.js';
import { STATUS_CODE } from '../utils/common.js';
import { subscribeValidation } from '../validations/notification.validation.js';

const subscribe = async (req, res) => {
    try {
        const { body } = req;
        const userId = req.user.id;
        logger('debug', `Subscribe user notification ${JSON.stringify(body)}`);

        // Validating the registration data
        const validation = subscribeValidation(body);
        if (validation.error) {
            logger('error', 'Notification Subscription validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await notificationService.subscribe({ userId, ...body });
        logger('info', 'Notification subscription successful', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred during notification subscription', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const unsubscribe = async (req, res) => {
    try {
        const userId = req.user.id;
        logger('debug', `Request to unsubscribe for user ${userId}`);

        const result = await notificationService.unsubscribe(userId);
        logger('info', 'Unsubscription successful', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred while un-subscribing notification', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const fetch = async (req, res) => {
    try {
        const userId = req.user.id;
        logger('debug', `Request to fetch notification ${userId}`);

        const result = await notificationService.fetch(userId);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred while fetching user notification', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const userId = req.user.id;
        logger('debug', `Request to updating notification ${userId}`);

        const result = await notificationService.update(userId);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred while updating user notification', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    subscribe,
    unsubscribe,
    fetch,
    update
};
