import { Router } from "express";
import hotelController from "../controllers/hotel.controller.js";
import authenticate from "../middlewares/auth.js";
import { ownerAuthentication } from "../middlewares/roleAuth.js";

const router = Router();

router.post('/', authenticate, ownerAuthentication, hotelController.register);
router.put('/:id', authenticate, hotelController.update);

export default router;
