import { Router } from 'express';
import { getSummary, getCategories, getMonthly } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/summary', getSummary);
router.get('/categories', getCategories);
router.get('/monthly', getMonthly);

export default router;
