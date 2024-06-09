import { Router } from 'express';
import orderController from '../controllers/order.controller.js';

const router = Router();

router.post('/customer', orderController.register);
router.get('/table/:id', orderController.getTableDetails);
router.get('/menu', orderController.getMenuDetails);
router.post('/', orderController.placeOrder);

export default router;
