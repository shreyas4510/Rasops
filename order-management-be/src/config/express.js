import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from '../api/routes/index.js';
import { swaggerDocument } from '../../swagger.js';

// create app using express
const app = express();

// middlware in express for parsing body
app.use(express.json());

// allow all origins for cors
app.use(cors({ origin: '*' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// prefix for all the routes
app.use('/api', routes);

export default app;
