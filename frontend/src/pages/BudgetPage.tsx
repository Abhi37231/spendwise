import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Health', 'Other'];

const BudgetPage = () => {
  const [budget, setBudget] = useState<{ amount: number } | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<any[]>([]);
  const [spent, setSpent] = useState(0);
  const [categorySpent, setCategorySpent] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const { register: regMonthly, handleSubmit: handleMonthly } = useForm();
  const { register: regCategory, handleSubmit: handleCategory, reset: resetCategory } = useForm();

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const [budgetRes, catBudgetRes, summaryRes, catRes] = await Promise.all([
        api.get('/budget'),
        api.get('/budget/categories'),
        api.get('/analytics/summary'),
        api.get('/analytics/categories')
      ]);

      setBudget(budgetRes.data);
      setCategoryBudgets(catBudgetRes.data);
      setSpent(summaryRes.data.totalSpent || 0);

      const catSpentMap: Record<string, number> = {};
      catRes.data.forEach((cat: any) => {
        catSpentMap[cat.name] = cat.amount;
      });
      setCategorySpent(catSpentMap);
    } catch (error) {
      console.error('Failed to fetch budget data', error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateMonthly = async (data: any) => {
    try {
      await api.post('/budget', { amount: data.amount });
      setToast({ message: 'Monthly budget updated!', type: 'success' });
      fetchBudgetData();
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ message: 'Failed to update budget.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const onAddCategoryBudget = async (data: any) => {
    try {
      await api.post('/budget/categories', { category: data.category, amount: data.amount });
      setToast({ message: 'Category budget updated!', type: 'success' });
      resetCategory();
      fetchBudgetData();
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ message: 'Failed to update category budget.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const calculateProgress = (spent: number, total: number) => {
    if (!total || total === 0) return 0;
    return Math.min((spent / total) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-success';
    if (percentage < 90) return 'bg-warning';
    return 'bg-destructive';
  };

  if (loading) {
    return <div className="animate-pulse">Loading budget data...</div>;
  }

  const budgetAmount = budget?.amount || 0;
  const monthlyPercentage = calculateProgress(spent, budgetAmount);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 text-white transition-opacity ${toast.type === 'success' ? 'bg-success' : 'bg-destructive'}`}>
          {toast.message}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Monthly Budget</h2>
        <p className="text-muted-foreground mt-1">Set and monitor your spending limits.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall Budget Overview</CardTitle>
            <CardDescription>Track your total spending against your limit.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(budgetAmount)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-xl font-semibold">{formatCurrency(spent)}</p>
              </div>
            </div>

            <div className="mt-4 mb-2 flex justify-between text-sm">
              <span className="font-medium">{monthlyPercentage.toFixed(1)}% used</span>
              <span className="text-muted-foreground">
                Remaining: {formatCurrency(Math.max(0, budgetAmount - spent))}
              </span>
            </div>
            
            <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getProgressColor(monthlyPercentage)}`} 
                style={{ width: `${monthlyPercentage}%` }} 
              />
            </div>
            
            {monthlyPercentage >= 90 && (
              <p className="text-sm text-destructive mt-3 flex items-center gap-1">
                ⚠️ Your spending is close to your monthly limit.
              </p>
            )}
            
            <form onSubmit={handleMonthly(onUpdateMonthly)} className="mt-8 pt-6 border-t flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="amount">Update Monthly Budget</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="E.g., 5000"
                  defaultValue={budgetAmount}
                  {...regMonthly('amount')}
                  required
                />
              </div>
              <Button type="submit">Update</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Set Category Budget</CardTitle>
            <CardDescription>Limit spending for specific categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCategory(onAddCategoryBudget)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  {...regCategory('category')}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="catAmount">Amount (₹)</Label>
                <Input
                  id="catAmount"
                  type="number"
                  placeholder="0"
                  {...regCategory('amount')}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Set Category Budget</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>Monitor how you're doing in individual categories.</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryBudgets.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No category budgets set yet.</p>
          ) : (
            <div className="space-y-6">
              {categoryBudgets.map(cb => {
                const catSpent = categorySpent[cb.category] || 0;
                const percentage = calculateProgress(catSpent, cb.amount);
                
                return (
                  <div key={cb.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{cb.category}</span>
                      <span>{formatCurrency(catSpent)} / {formatCurrency(cb.amount)}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(percentage)}`} 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPage;
