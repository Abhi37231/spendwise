import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';
import budgetRoutes from './routes/budget.routes';
import analyticsRoutes from './routes/analytics.routes';
import profileRoutes from './routes/profile.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/profile', profileRoutes);

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
