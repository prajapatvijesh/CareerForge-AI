import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();
const controller = new DashboardController();

// All dashboard routes require authentication
router.use(requireAuth);

router.get('/summary', controller.getSummary);

export const dashboardRouter = router;
