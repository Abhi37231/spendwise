import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const expenseSchema = z.object({
  amount: z.coerce.number().min(1, 'Please enter a valid amount'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(1, 'Description is required').max(100),
  date: z.string().min(1, 'Date is required'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  notes: z.string().max(500).optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Health', 'Other'];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

const AddExpensePage = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: '',
      paymentMethod: '',
    }
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      setLoading(true);
      await api.post('/expenses', data);
      setToast({ message: 'Expense added successfully!', type: 'success' });
      reset({ date: new Date().toISOString().split('T')[0] });
      
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ message: 'Failed to add expense. Please try again.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 text-white transition-opacity ${toast.type === 'success' ? 'bg-success' : 'bg-destructive'}`}>
          {toast.message}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add Expense</h2>
        <p className="text-muted-foreground mt-1">Record a new transaction.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Fill in the required information to track your spending.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount')}
                  className={errors.amount ? 'border-destructive' : ''}
                />
                {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className={errors.date ? 'border-destructive' : ''}
                />
                {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="E.g., Lunch at College Canteen"
                {...register('description')}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.category ? 'border-destructive' : ''}`}
                  {...register('category')}
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.paymentMethod ? 'border-destructive' : ''}`}
                  {...register('paymentMethod')}
                >
                  <option value="" disabled>Select payment method</option>
                  {PAYMENT_METHODS.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
                {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Optional Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Any extra details..."
                {...register('notes')}
              />
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/transactions')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save Expense'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpensePage;
