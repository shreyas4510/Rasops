import { Router } from 'express';
import checkoutController from '../controllers/checkout.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.post('/business', authenticate, checkoutController.business);
router.post('/stakeholder', authenticate, checkoutController.stakeholder);
router.post('/account', authenticate, checkoutController.account);
router.post('/success', authenticate, checkoutController.success);
router.post('/payment', checkoutController.payment);
router.post('/confirm', checkoutController.paymentConfirmation);
router.post('/subscribe', authenticate, checkoutController.subscribe);
router.post('/cancel', authenticate, checkoutController.cancel);

export default router;
