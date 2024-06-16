import webpush from 'web-push';
import env from './env.js';
import logger from './logger.js';

export const initNotifications = async () => {
    webpush.setVapidDetails(
        `mailto:${env.notification.email}`,
        env.notification.publicKey,
        env.notification.privateKey
    );

    logger('info', '🔗 Notification connection successful');
};
