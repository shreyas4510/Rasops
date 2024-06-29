import { Router } from 'express';
import checkoutController from '../controllers/checkout.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.post('/business', authenticate, checkoutController.business);
router.post('/stakeholder', authenticate, checkoutController.stakeholder);
router.post('/account', authenticate, checkoutController.account);
router.post('/subscribe', authenticate, checkoutController.subscribe);
router.post('/success', authenticate, checkoutController.success);
router.post('/payment', checkoutController.payment);
router.post('/payment/:customerId', checkoutController.paymentConfirmation);

export default router;
