import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowDownRight, ArrowUpRight, Wallet, CreditCard, Activity, TrendingUp, Target } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Travel: '#3b82f6',
  Shopping: '#ec4899',
  Education: '#8b5cf6',
  Entertainment: '#10b981',
  Health: '#ef4444',
  Other: '#64748b'
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [spendingData, setSpendingData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, categoriesRes, txRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/categories'),
          api.get('/expenses')
        ]);
        
        setSummary(summaryRes.data);
        setCategories(categoriesRes.data);
        
        // Take top 5 recent transactions
        setRecentTransactions(txRes.data.slice(0, 5));

        // Group expenses by day for the chart
        const dailyTotals: Record<string, number> = {};
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
          dailyTotals[i] = 0;
        }

        txRes.data.forEach((tx: any) => {
          const date = new Date(tx.date);
          if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
            dailyTotals[date.getDate()] += tx.amount;
          }
        });

        const chartData = Object.keys(dailyTotals).map(day => ({
          day: day,
          amount: dailyTotals[day]
        }));
        
        setSpendingData(chartData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-muted rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-4 h-96 bg-muted rounded-xl"></div>
          <div className="lg:col-span-3 h-96 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Good morning, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-muted-foreground mt-1">Here's your financial overview for this month.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Spent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalSpent || 0)}</div>
            <p className={`text-xs flex items-center mt-1 ${summary?.spendingChange > 0 ? 'text-destructive' : 'text-success'}`}>
              {summary?.spendingChange > 0 ? (
                <><ArrowUpRight className="mr-1 h-3 w-3" /> {summary?.spendingChange}% from last month</>
              ) : (
                <><ArrowDownRight className="mr-1 h-3 w-3" /> {Math.abs(summary?.spendingChange || 0)}% from last month</>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Monthly Budget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.budgetAmount || 0)}</div>
            <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${summary?.totalSpent > summary?.budgetAmount ? 'bg-destructive' : 'bg-primary'}`} 
                style={{ width: `${Math.min((summary?.totalSpent / summary?.budgetAmount) * 100 || 0, 100)}%` }} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Remaining */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(summary?.remaining || 0) < 0 ? 'text-destructive' : ''}`}>
              {formatCurrency(summary?.remaining || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Until end of month
            </p>
          </CardContent>
        </Card>

        {/* Daily Average */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.dailyAverage || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on days passed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(val) => `₹${val}`}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Where Your Money Goes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full mt-4 space-y-2">
              {categories.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[cat.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other }} 
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link to="/transactions" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found.</p>
              <Link to="/add-expense" className="text-primary hover:underline mt-2 inline-block">
                Add your first expense
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: CATEGORY_COLORS[tx.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other }}
                    >
                      {tx.category.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {tx.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-foreground">
                    -{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
