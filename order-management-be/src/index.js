import initDb from './config/database.js';
import env from './config/env.js';
import app from './config/express.js';
import logger from './config/logger.js';
import { initNotifications } from './config/notification.js';

const startServer = async () => {
    try {
        logger('info', '🚀 Starting server...');

        logger('info', '🔗 Establishing database connection...');
        await initDb();

        logger('info', '🔗 Establishing Notification connection...');
        await initNotifications();

        logger('info', `🌐 Server running on port ${env.app.port}...`);
        app.listen(env.app.port, () => {
            logger('info', `✅ Server started successfully on port ${env.app.port}.`);
        });

        app.on('error', (error) => {
            logger('error', `❌ Error starting server: ${error}`);
        });
    } catch (error) {
        logger('error', `❌ Error starting server: ${error}`);
    }
};

const server = startServer();
export const maxDuration = 25;
export default server;
