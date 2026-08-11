import { Router } from 'express';
import { AnalysisController } from './analysis.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { triggerAnalysisSchema, getAnalysisParamsSchema } from './analysis.schema';
import { checkSubscriptionLimit } from '../../middlewares/checkSubscriptionLimit';

const router = Router();
const controller = new AnalysisController();

// Require authentication for all analysis routes
router.use(requireAuth);

router.post('/', validateRequest(triggerAnalysisSchema), checkSubscriptionLimit('RESUME_ANALYSIS'), controller.triggerAnalysis);
router.get('/:resumeId', validateRequest(getAnalysisParamsSchema), controller.getLatestAnalysis);
router.get('/:resumeId/history', validateRequest(getAnalysisParamsSchema), controller.getAnalysisHistory);

export { router as analysisRouter };
