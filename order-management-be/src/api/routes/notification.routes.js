import { Router } from 'express';
import authenticate from '../middlewares/auth.js';
import notificationController from '../controllers/notification.controller.js';

const router = Router();

router.post('/subscribe', authenticate, notificationController.subscribe);
router.post('/unsubscribe/:userId', authenticate, notificationController.unsubscribe);

export default router;
