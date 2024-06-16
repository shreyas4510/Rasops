import logger from '../../config/logger.js';
import notificationService from '../services/notification.service.js';
import { STATUS_CODE } from '../utils/common.js';
import { subscribeValidation } from '../validations/notification.validation.js';

const subscribe = async (req, res) => {
    try {
        const { body } = req;
        logger('debug', `Subscribe user notification ${JSON.stringify(body)}`);

        // Validating the registration data
        const validation = subscribeValidation(body);
        if (validation.error) {
            logger('error', 'Notification Subscription validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await notificationService.subscribe(body);
        logger('info', 'Notification subscription successful', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred during notification subscription', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const unsubscribe = async (req, res) => {
    try {
        const { userId } = req.params;
        logger('debug', `Request to unsubscribe for user ${ userId }`);

        const result = await notificationService.unsubscribe(userId);
        logger('info', 'Unsubscription successful', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred while un-subscribing notification', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    subscribe,
    unsubscribe
};
