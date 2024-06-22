import { Router } from 'express';
import checkoutController from '../controllers/checkout.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.post('/business', authenticate, checkoutController.business);
router.post('/stakeholder', authenticate, checkoutController.stakeholder);
router.post('/account', authenticate, checkoutController.account);

export default router;
