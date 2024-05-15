import { Router } from 'express';
import hotelRoutes from './hotel.routes.js';
import userRoutes from './user.routes.js';

const router = Router();
router.use('/user', userRoutes);
router.use('/hotel', hotelRoutes);

export default router;
