import { Router } from "express";
import userController from "../controllers/user.controllers.js";
import authenticate from "../middlewares/auth.js";
import { ownerAuthentication } from "../middlewares/roleAuth.js";

const router = Router();

// owner apis
router.post('/register', userController.create);
router.post('/login', userController.login);
router.post('/verify', userController.verify);
router.post('/forget', userController.forget);
router.post('/reset', userController.reset);

// invite apis
router.route('/invite')
    .all(authenticate, ownerAuthentication)
    .post(userController.invite)
    .get(userController.listInvites)
    .delete(userController.removeInvite);

export default router;
