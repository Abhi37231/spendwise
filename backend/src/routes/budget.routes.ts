import { Router } from 'express';
import { getBudget, updateBudget, getCategoryBudgets, updateCategoryBudget } from '../controllers/budget.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getBudget);
router.post('/', updateBudget);
router.get('/categories', getCategoryBudgets);
router.post('/categories', updateCategoryBudget);

export default router;
