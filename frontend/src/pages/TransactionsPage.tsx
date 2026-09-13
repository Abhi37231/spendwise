import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Filter, ArrowUpDown, Trash2, Edit, Plus, FileDown } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Travel: '#3b82f6',
  Shopping: '#ec4899',
  Education: '#8b5cf6',
  Entertainment: '#10b981',
  Health: '#ef4444',
  Other: '#64748b'
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/expenses');
      setTransactions(res.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/expenses/${deleteId}`);
      setTransactions(transactions.filter(t => t.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? t.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground mt-1">Manage your expenses and history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown size={16} />
            Export
          </Button>
          <Link to="/add-expense">
            <Button className="gap-2">
              <Plus size={16} />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex h-10 w-full sm:w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Button variant="outline" size="icon">
                <ArrowUpDown size={16} />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b hidden sm:table-header-group">
                <tr>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading transactions...</td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-lg font-medium">No expenses found</h3>
                        <p className="text-muted-foreground mt-1 mb-4">Start tracking your spending by adding an expense.</p>
                        <Link to="/add-expense">
                          <Button>Add Expense</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors flex flex-col sm:table-row">
                      <td className="px-4 py-3 font-medium flex justify-between sm:table-cell">
                        <span className="sm:hidden text-muted-foreground">Description</span>
                        {tx.description}
                      </td>
                      <td className="px-4 py-3 flex justify-between sm:table-cell">
                        <span className="sm:hidden text-muted-foreground">Category</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: CATEGORY_COLORS[tx.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other }} 
                          />
                          {tx.category}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground flex justify-between sm:table-cell">
                        <span className="sm:hidden text-foreground">Date</span>
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground flex justify-between sm:table-cell">
                        <span className="sm:hidden text-foreground">Payment</span>
                        {tx.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-right font-medium flex justify-between sm:table-cell">
                        <span className="sm:hidden text-muted-foreground">Amount</span>
                        <span className="text-foreground">-{formatCurrency(tx.amount)}</span>
                      </td>
                      <td className="px-4 py-3 flex justify-end gap-2 sm:table-cell sm:text-center mt-2 sm:mt-0">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteId(tx.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm m-4 shadow-2xl">
            <CardHeader>
              <CardTitle>Delete Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Are you sure you want to delete this expense? This action cannot be undone.</p>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
