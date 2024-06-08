import { Router } from 'express';
import orderController from '../controllers/order.controller.js';

const router = Router();

router.post('/customer', orderController.register)
router.get('/table/:id', orderController.getTableDetails)

export default router;
