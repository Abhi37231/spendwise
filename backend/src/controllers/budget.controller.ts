import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getBudget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { month, year } = req.query;
    const m = month ? Number(month) : new Date().getMonth() + 1;
    const y = year ? Number(year) : new Date().getFullYear();

    let budget = await prisma.budget.findFirst({
      where: { userId: req.userId, month: m, year: y },
    });

    if (!budget) {
      // Return a default budget if not set yet
      res.json({ amount: 0, month: m, year: y });
      return;
    }

    res.json(budget);
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, month, year } = req.body;
    const m = month ? Number(month) : new Date().getMonth() + 1;
    const y = year ? Number(year) : new Date().getFullYear();

    const budget = await prisma.budget.upsert({
      where: {
        userId_month_year: {
          userId: req.userId as string,
          month: m,
          year: y,
        },
      },
      update: { amount: Number(amount) },
      create: {
        userId: req.userId as string,
        amount: Number(amount),
        month: m,
        year: y,
      },
    });

    res.json(budget);
  } catch (error) {
    next(error);
  }
};

export const getCategoryBudgets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { month, year } = req.query;
    const m = month ? Number(month) : new Date().getMonth() + 1;
    const y = year ? Number(year) : new Date().getFullYear();

    const categoryBudgets = await prisma.categoryBudget.findMany({
      where: { userId: req.userId, month: m, year: y },
    });

    res.json(categoryBudgets);
  } catch (error) {
    next(error);
  }
};

export const updateCategoryBudget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, amount, month, year } = req.body;
    const m = month ? Number(month) : new Date().getMonth() + 1;
    const y = year ? Number(year) : new Date().getFullYear();

    const categoryBudget = await prisma.categoryBudget.upsert({
      where: {
        userId_category_month_year: {
          userId: req.userId as string,
          category,
          month: m,
          year: y,
        },
      },
      update: { amount: Number(amount) },
      create: {
        userId: req.userId as string,
        category,
        amount: Number(amount),
        month: m,
        year: y,
      },
    });

    res.json(categoryBudget);
  } catch (error) {
    next(error);
  }
};
