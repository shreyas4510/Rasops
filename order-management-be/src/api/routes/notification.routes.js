import { Router } from 'express';
import notificationController from '../controllers/notification.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.post('/subscribe', authenticate, notificationController.subscribe);
router.post('/unsubscribe', authenticate, notificationController.unsubscribe);

export default router;
