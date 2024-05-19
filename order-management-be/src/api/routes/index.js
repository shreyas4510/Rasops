import { Router } from 'express';
import hotelRoutes from './hotel.routes.js';
import managerRoutes from './manager.routes.js';
import userRoutes from './user.routes.js';

const router = Router();
router.use('/user', userRoutes);
router.use('/hotel', hotelRoutes);
router.use('/manager', managerRoutes);

export default router;
