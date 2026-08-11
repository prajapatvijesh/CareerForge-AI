import { Router } from 'express';
import { CareerAssistantController } from './career-assistant.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();
const controller = new CareerAssistantController();

router.use(requireAuth);

router.post('/chat', controller.chat);
router.get('/conversations', controller.getConversations);
router.get('/conversations/:id', controller.getConversationDetails);
router.delete('/conversations/:id', controller.deleteConversation);

export const careerAssistantRouter = router;
