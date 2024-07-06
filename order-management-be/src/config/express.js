import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../../swagger.js';
import routes from '../api/routes/index.js';

// create app using express
const app = express();

// middlware in express for parsing body
app.use(express.json());

// allow all origins for cors
app.use(cors({ origin: '*' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (_req, res) => {
    res.send('Welcome to Raspos, your premier hotel order management solution!');
});

// prefix for all the routes
app.use('/api', routes);

export default app;
