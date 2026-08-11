import { Router } from 'express';
import { ResumeController } from './resume.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createResumeSchema, updateResumeSchema } from './resume.schema';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();
const controller = new ResumeController();

router.use(requireAuth);

router.get('/', controller.getResumes);
router.post('/', validateRequest(createResumeSchema), controller.createResume);

router.get('/:id', controller.getResumeById);
router.patch('/:id', validateRequest(updateResumeSchema), controller.updateResume); // Autosave endpoint
router.delete('/:id', controller.deleteResume);

router.post('/:id/duplicate', controller.duplicateResume);
router.post('/:id/versions', controller.createSnapshot);
router.post('/:id/export/pdf', controller.exportPdf);

export { router as resumeRouter };
