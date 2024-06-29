import { Router } from 'express';
import orderController from '../controllers/order.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.post('/', orderController.placeOrder);
router.post('/customer', orderController.register);
router.put('/pending', authenticate, orderController.updatePending);
router.post('/payment', orderController.payment);
router.get('/menu', orderController.getMenuDetails);
router.post('/feedback', orderController.feedback);
router.get('/table/:id', orderController.getTableDetails);
router.post('/payment/:customerId', orderController.paymentConfirmation);
router.get('/completed/:hotelId', authenticate, orderController.completed);
router.get('/active/:tableId', authenticate, orderController.active);
router.get('/:customerId', orderController.getOrder);

export default router;
