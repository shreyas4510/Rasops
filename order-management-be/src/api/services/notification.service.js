import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import webpush from 'web-push';
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { NOTIFICATION_STATUS } from '../models/notification.model.js';
import { NOTIFICATION_PREFERENCE } from '../models/preferences.model.js';
import notificationRepo from '../repositories/notification.repository.js';
import pushSubscriptionRepo from '../repositories/pushSubscription.repository.js';
import { CustomError } from '../utils/common.js';

const subscribe = async (payload) => {
    try {
        const data = {
            id: uuidv4(),
            endpoint: payload.endpoint,
            expirationTime: payload.expirationTime,
            p256dh: payload.keys.p256dh,
            auth: payload.keys.auth
        };

        if (payload.userId) {
            data.userId = payload.userId;
            await unsubscribe(payload.userId);
            logger('debug', `Removing all previous records for userId : ${payload.userId}`);
        }

        if (payload.customerId) {
            data.customerId = payload.customerId;
            await unsubscribe(undefined, payload.customerId);
            logger('debug', `Removing all previous records for customer : ${payload.customerId}`);
        }
        logger('debug', 'Data for subscribing notification', data);

        const res = await pushSubscriptionRepo.save(data);
        logger('info', `Notification subscription successful for user: ${payload.userId}`, res);

        return res;
    } catch (error) {
        logger('error', 'Error while subscribing notification', { error });
        throw CustomError(error.code, error.message);
    }
};

const unsubscribe = async (userId, customerId) => {
    try {
        const options = { where: { userId } };
        if (userId) {
            options.where = { userId };
        }

        if (customerId) {
            options.where = { customerId };
        }
        logger('debug', 'Data for un-subscribing notification', options);

        const res = await pushSubscriptionRepo.remove(options);
        logger('info', `Notification un-subscribed successfully for user: ${userId}`, res);

        return { message: 'Success' };
    } catch (error) {
        logger('error', 'Error while un-subscribing  notification', { error });
        throw CustomError(error.code, error.message);
    }
};

const sendNotification = async (userIds, data, customerId = undefined) => {
    try {
        let options = {};
        if (userIds?.length) {
            options = {
                where: {
                    userId: { [Op.in]: userIds }
                },
                include: [
                    {
                        model: db.users,
                        attributes: ['id'],
                        include: [
                            {
                                model: db.preferences,
                                where: {
                                    notification: NOTIFICATION_PREFERENCE[0]
                                },
                                attributes: ['notification']
                            }
                        ]
                    }
                ]
            };
        }

        if (customerId) {
            options = {
                where: { customerId }
            };
        }

        logger('debug', 'Options to fetch push subscription data', options);

        const { rows: subscriptions } = await pushSubscriptionRepo.find(options);
        logger('debug', 'Subscription data received', subscriptions);

        await Promise.all(
            subscriptions.map(async (subscriptionData) => {
                const preference = customerId ? true : subscriptionData.user?.preference?.notification;
                logger(
                    'debug',
                    `Notification preference for user: ${subscriptionData.userId} preference: ${preference}`
                );

                if (preference) {
                    await webpush.sendNotification(
                        {
                            endpoint: subscriptionData.endpoint,
                            expirationTime: subscriptionData.expiration,
                            keys: {
                                p256dh: subscriptionData.p256dh,
                                auth: subscriptionData.auth
                            }
                        },
                        JSON.stringify(data)
                    );

                    if (!customerId) {
                        const notificationData = {
                            id: uuidv4(),
                            userId: subscriptionData.userId,
                            title: data.title || '',
                            message: data.message || '',
                            path: data.path
                        };
                        logger('debug', 'storing notification details', notificationData);
                        await notificationRepo.save(notificationData);
                    }
                }
            })
        );
    } catch (error) {
        logger('error', 'Error while sending notification', { error });
    }
};

const fetch = async (userId) => {
    try {
        const options = {
            where: {
                userId,
                status: NOTIFICATION_STATUS[0]
            },
            order: [['updatedAt', 'DESC']],
            limit: 50
        };
        const notifications = await notificationRepo.find(options);
        return notifications;
    } catch (error) {
        logger('error', 'Error while fetching notification', { error });
        throw CustomError(error.code, error.message);
    }
};

const update = async (userId) => {
    try {
        const options = { where: { userId } };
        const data = { status: NOTIFICATION_STATUS[1] };
        await notificationRepo.update(options, data);

        return { message: 'SUCCESS' };
    } catch (error) {
        logger('error', 'Error while updating notification', { error });
        throw CustomError(error.code, error.message);
    }
};

export default {
    subscribe,
    unsubscribe,
    sendNotification,
    fetch,
    update
};
