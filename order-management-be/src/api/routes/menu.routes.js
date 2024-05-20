import { Router } from 'express';
import menuController from '../controllers/menu.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.post('/category', authenticate, menuController.createCategory);

export default router;
