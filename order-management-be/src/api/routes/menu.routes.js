import { Router } from 'express';
import menuController from '../controllers/menu.controller.js';
import authenticate from '../middlewares/auth.js';

const router = Router();

router.route('/category').all(authenticate).post(menuController.createCategory).delete(menuController.removeCategory);
router.get('/category/:hotelId', authenticate, menuController.fetchCategory);
router.put('/category/:id', authenticate, menuController.updateCategory);

router.post('/', authenticate, menuController.create);
router
    .route('/:id')
    .all(authenticate)
    .put(menuController.update)
    .delete(menuController.remove)
    .get(menuController.fetch);

export default router;
