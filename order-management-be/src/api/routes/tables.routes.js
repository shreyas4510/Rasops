import { Router } from 'express';
import tableController from '../controllers/table.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, tableController.create);

export default router;
