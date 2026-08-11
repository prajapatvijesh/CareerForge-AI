import { Router } from 'express';
import { JobController } from './job.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { createJobSchema, updateJobSchema, getJobsQuerySchema } from './job.schema';

const router = Router();
const controller = new JobController();

// Require authentication for all job routes
router.use(requireAuth);

router.post('/', validateRequest(createJobSchema), controller.createJob);
router.get('/', validateRequest(getJobsQuerySchema), controller.getJobs);
// Note: /stats must come before /:id to prevent "stats" from being parsed as an ID
router.get('/stats', controller.getJobStats);
router.get('/:id', controller.getJobById);
router.patch('/:id', validateRequest(updateJobSchema), controller.updateJob);
router.delete('/:id', controller.deleteJob);

export { router as jobRouter };
