import { Router } from 'express';
import { getExpenses, getExpense, createExpense, updateExpense, deleteExpense } from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getExpenses);
router.get('/:id', getExpense);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
