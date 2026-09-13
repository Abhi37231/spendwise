import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { month, year } = req.query;
    const m = month ? Number(month) : new Date().getMonth() + 1;
    const y = year ? Number(year) : new Date().getFullYear();

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const prevStartDate = new Date(y, m - 2, 1);
    const prevEndDate = new Date(y, m - 1, 0, 23, 59, 59);

    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.userId,
        date: { gte: startDate, lte: endDate },
      },
    });

    const prevExpenses = await prisma.expense.findMany({
      where: {
        userId: req.userId,
        date: { gte: prevStartDate, lte: prevEndDate },
      },
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const prevTotalSpent = prevExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    let spendingChange = 0;
    if (prevTotalSpent > 0) {
      spendingChange = ((totalSpent - prevTotalSpent) / prevTotalSpent) * 100;
    }

    const budget = await prisma.budget.findFirst({
      where: { userId: req.userId, month: m, year: y },
    });

    const budgetAmount = budget?.amount || 0;
    const remaining = budgetAmount - totalSpent;
    const daysInMonth = endDate.getDate();
    const dailyAverage = totalSpent / daysInMonth;

    res.json({
      totalSpent,
      spendingChange: Number(spendingChange.toFixed(1)),
      budgetAmount,
      remaining,
      dailyAverage: Number(dailyAverage.toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { month, year } = req.query;
    const m = month ? Number(month) : new Date().getMonth() + 1;
    const y = year ? Number(year) : new Date().getFullYear();

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.userId,
        date: { gte: startDate, lte: endDate },
      },
    });

    const categoryMap: Record<string, number> = {};
    let total = 0;
    
    expenses.forEach((exp) => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
      total += exp.amount;
    });

    const categories = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      amount: categoryMap[cat],
      percentage: total > 0 ? Number(((categoryMap[cat] / total) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b.amount - a.amount);

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getMonthly = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'asc' },
    });

    const monthlyMap: Record<string, number> = {};
    expenses.forEach((exp) => {
      const monthYear = `${exp.date.getFullYear()}-${String(exp.date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + exp.amount;
    });

    const monthly = Object.keys(monthlyMap).map((key) => {
      const [y, m] = key.split('-');
      const date = new Date(Number(y), Number(m) - 1, 1);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: Number(y),
        amount: monthlyMap[key],
      };
    });

    res.json(monthly);
  } catch (error) {
    next(error);
  }
};
