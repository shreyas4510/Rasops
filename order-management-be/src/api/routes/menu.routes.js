import { Router } from 'express';
import menuController from '../controllers/menu.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.route('/category').all(authenticate).post(menuController.createCategory).delete(menuController.removeCategory);
router.get('/category/:hotelId', authenticate, menuController.fetchCategory);
router.put('/category/:id', authenticate, menuController.updateCategory);

router.route('/').all(authenticate).post(menuController.create).delete(menuController.remove);

router.route('/:id').all(authenticate).put(menuController.update).get(menuController.fetch);

export default router;
