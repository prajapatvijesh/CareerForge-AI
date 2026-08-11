import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema } from './auth.schema';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();
const controller = new AuthController();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window for auth
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

router.post('/register', authLimiter, validateRequest(registerSchema), controller.register);
router.post('/login', authLimiter, validateRequest(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.getMe);

export { router as authRouter };
