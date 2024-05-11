import initDb from './config/database.js';
import app from './config/express.js';
import env from './config/env.js';
import logger from './config/logger.js';

const startServer = async () => {
    try {
        logger('info', '🚀 Starting server...');

        logger('info', '🔗 Establishing database connection...');
        await initDb();

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

startServer();
