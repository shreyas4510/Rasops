import { Router } from 'express';
import tableController from '../controllers/table.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.route('/:hotelId')
    .all(authenticate)
    .get(tableController.fetch)
    .post(tableController.create)
    .delete(tableController.remove);

export default router;
