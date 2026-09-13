import { Router } from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', updatePassword);

export default router;
