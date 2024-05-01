import { Router } from "express";
import userRoutes from "./user.routes.js";
import hotelRoutes from "./hotel.routes.js";

const router = Router();
router.use('/user', userRoutes);
router.use('/hotel', hotelRoutes);

export default router
