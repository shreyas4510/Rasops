import initDb from './config/database.js';
import app from './config/express.js';
import env from './config/env.js';

const startServer = async () => {
	try {
		// Establish database connection
		await initDb();

		// TODO: Implement logging in this file properly

		// Start the server
		app.listen(env.app.port, () => {});

		// Error in starting server
		app.on('error', () => {});
	} catch (error) {}
};

startServer();
