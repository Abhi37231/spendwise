import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const expense = await prisma.expense.findFirst({
      where: { id, userId: req.userId },
    });

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, category, description, date, paymentMethod, notes } = req.body;

    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        category,
        description,
        date: new Date(date),
        paymentMethod,
        notes,
        userId: req.userId as string,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { amount, category, description, date, paymentMethod, notes } = req.body;

    // Verify ownership
    const existing = await prisma.expense.findFirst({ where: { id, userId: req.userId } });
    if (!existing) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        amount: amount ? Number(amount) : undefined,
        category,
        description,
        date: date ? new Date(date) : undefined,
        paymentMethod,
        notes,
      },
    });

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Verify ownership
    const existing = await prisma.expense.findFirst({ where: { id, userId: req.userId } });
    if (!existing) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    await prisma.expense.delete({ where: { id } });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};
