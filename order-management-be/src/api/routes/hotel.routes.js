import { Router } from "express";
import hotelController from "../controllers/hotel.controller.js";
import authenticate from "../middlewares/auth.js";

const router = Router();
const basePath = '/';

router.route(basePath)
    .all(authenticate)
    .post(hotelController.register)

export default router;
