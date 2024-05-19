import { Router } from "express"
import managerController from '../controllers/manager.controller.js';
import authenticate from "../middlewares/auth.js";
import { ownerAuthentication } from "../middlewares/roleAuth.js";

const router = Router();

router.get('/', authenticate, ownerAuthentication, managerController.fetch);
router.put('/:id', authenticate, ownerAuthentication, managerController.update);
export default router;
