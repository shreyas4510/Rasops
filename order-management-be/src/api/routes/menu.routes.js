import { Router } from 'express';
import menuController from '../controllers/menu.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, menuController.create);

router.post('/category', authenticate, menuController.createCategory);
router.get('/category/:hotelId', authenticate, menuController.fetchCategory);
router
    .route('/category/:id')
    .all(authenticate)
    .put(menuController.updateCategory)
    .delete(menuController.removeCategory);

export default router;
