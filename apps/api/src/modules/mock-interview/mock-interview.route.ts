import { Router } from 'express';
import { MockInterviewController } from './mock-interview.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { startInterviewSchema, answerSubmissionSchema, getInterviewParamsSchema } from './mock-interview.schema';
import { checkSubscriptionLimit } from '../../middlewares/checkSubscriptionLimit';

const router = Router();
const controller = new MockInterviewController();

// Require authentication for all mock interview routes
router.use(requireAuth);

router.post('/start', validateRequest(startInterviewSchema), checkSubscriptionLimit('MOCK_INTERVIEW'), controller.startInterview);
router.get('/history', controller.getHistory);
router.get('/:id', validateRequest(getInterviewParamsSchema), controller.getInterview);
router.post('/:id/answer', validateRequest(answerSubmissionSchema), controller.submitAnswer);
router.post('/:id/finish', validateRequest(getInterviewParamsSchema), controller.finishInterview);

export { router as mockInterviewRouter };
