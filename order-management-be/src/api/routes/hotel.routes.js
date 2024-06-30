import { Router } from 'express';
import hotelController from '../controllers/hotel.controller.js';
import authenticate from '../middlewares/auth.js';
import { ownerAuthentication } from '../middlewares/roleAuth.js';

const router = Router();

router.put('/:id', authenticate, hotelController.update);
router.route('/').all(authenticate, ownerAuthentication).post(hotelController.register).get(hotelController.list);
router.delete('/:id', authenticate, ownerAuthentication, hotelController.remove);
router.get('/dashboard/:hotelId', authenticate, hotelController.dashboard);

export default router;
