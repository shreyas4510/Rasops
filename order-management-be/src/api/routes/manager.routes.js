import { Router } from 'express';
import managerController from '../controllers/manager.controller.js';
import authenticate from '../middlewares/auth.js';
import { ownerAuthentication } from '../middlewares/roleAuth.js';

const router = Router();

router.get('/', authenticate, ownerAuthentication, managerController.fetch);
router.put('/:id', authenticate, ownerAuthentication, managerController.update);
router.delete('/:id', authenticate, ownerAuthentication, managerController.remove);
router.get('/assignable', authenticate, ownerAuthentication, managerController.getAssignable);

export default router;
