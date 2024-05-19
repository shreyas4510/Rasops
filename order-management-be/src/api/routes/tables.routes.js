import { Router } from 'express';
import tableController from '../controllers/table.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.route('/').all(authenticate).post(tableController.create).get(tableController.fetch);
router.delete('/:id', authenticate, tableController.remove);

export default router;
