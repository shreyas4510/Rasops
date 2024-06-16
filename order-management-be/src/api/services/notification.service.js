import { db } from "../../config/database";
import logger from "../../config/logger";
import pushSubscriptionRepo from "../repositories/pushSubscription.repository";
import { CustomError } from "../utils/common";
import webpush from "web-push";
import { v4 as uuidv4 } from 'uuid';
import notificationRepo from "../repositories/notification.repository";

const subscribe = async (payload) => {
    try {
        const data = {
            userId: payload.userId,
            endpoint: payload.endpoint,
            expirationTime: payload.expirationTime,
            p256dh: payload.p256dh,
            auth: payload.auth
        };
        logger('debug', 'Data for subscribing notification', data);

        const res = await pushSubscriptionRepo.save(data);
        logger('info', `Notification subscription successful for user: ${payload.userId}`, res);

        return res;
    } catch (error) {
        logger('error', 'Error while subscribing notification', { error });
        throw CustomError(error.code, error.message);
    }
};

const unsubscribe = async (userId) => {
    try {
        const options = { where: { userId } };
        logger('debug', 'Data for un-subscribing notification', options);

        const res = await pushSubscriptionRepo.remove(options);
        logger('info', `Notification un-subscribed successfully for user: ${userId}`, res);

        return res;
    } catch (error) {
        logger('error', 'Error while un-subscribing  notification', { error });
        throw CustomError(error.code, error.message);
    }
};

const sendNotification = async (userId, data) => {
    try {
        const options = {
            where: { userId },
            include: [
                {
                    model: db.users,
                    attributes: ['id'],
                    include: [
                        {
                            model: db.preferences,
                            attributes: ['notification'],
                        }
                    ]
                }
            ],
        };
        logger('debug', 'Options to fetch push subscription data', options);

        const subscriptionData = await pushSubscriptionRepo.find(options);
        logger('debug', 'Subscription data received', subscriptionData);

        const preference = subscriptionData.users[0]?.preferences[0]?.notification;
        logger('debug', `Notification preference for user: ${ userId } preference: ${ preference }`);

        if (preference) {
            await webpush.sendNotification({
                endpoint: subscriptionData.endpoint,
                expirationTime: subscriptionData.expiration,
                keys: {
                    p256dh: subscriptionData.p256dh,
                    auth: subscriptionData.auth
                }
            }, JSON.stringify(data));

            const notificationData = {
                id: uuidv4(),
                userId,
                title: data.title || '',
                message: data.message || '',
                path: data.path
            }
            logger('debug', 'storing notification details', notificationData);
            await notificationRepo.save(notificationData);
        }
    } catch (error) {
        logger('error', 'Error while sending notification', { error });
        throw CustomError(error.code, error.message);
    }
}

export default {
    subscribe,
    unsubscribe,
    sendNotification
};
