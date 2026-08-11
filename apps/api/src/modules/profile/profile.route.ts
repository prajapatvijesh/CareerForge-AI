import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from './profile.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateProfileSchema } from './profile.schema';
import { requireAuth } from '../../middlewares/requireAuth';
import { AppError } from '../../utils/AppError';

const router = Router();
const controller = new ProfileController();

// Configure multer for memory storage and file filtering
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400));
    }
  }
});

router.use(requireAuth); // Protect all profile routes

router.get('/', controller.getProfile);
router.put('/', validateRequest(updateProfileSchema), controller.updateProfile);
router.post('/avatar', upload.single('avatar'), controller.uploadAvatar);

export { router as profileRouter };
