import { Router } from 'express';
import hotelRoutes from './hotel.routes.js';
import managerRoutes from './manager.routes.js';
import tableRoutes from './tables.routes.js';
import userRoutes from './user.routes.js';

const router = Router();
router.use('/user', userRoutes);
router.use('/hotel', hotelRoutes);
router.use('/manager', managerRoutes);
router.use('/table', tableRoutes);

export default router;
