import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Travel: '#3b82f6',
  Shopping: '#ec4899',
  Education: '#8b5cf6',
  Entertainment: '#10b981',
  Health: '#ef4444',
  Other: '#64748b'
};

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [monthlyRes, categoriesRes, summaryRes] = await Promise.all([
        api.get('/analytics/monthly'),
        api.get('/analytics/categories'),
        api.get('/analytics/summary')
      ]);

      setMonthlyData(monthlyRes.data);
      setCategories(categoriesRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  if (loading) {
    return <div className="animate-pulse">Loading analytics data...</div>;
  }

  // Generate Insights
  const topCategory = categories.length > 0 ? categories[0] : null;
  const spendingChange = summary?.spendingChange || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-1">Deep dive into your spending patterns.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Insights Cards */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {topCategory 
                ? <><strong className="text-primary">{topCategory.name}</strong> is your highest spending category this month, making up {topCategory.percentage}% of your expenses.</>
                : 'Not enough data to determine top category.'}
            </p>
          </CardContent>
        </Card>

        <Card className={spendingChange > 0 ? 'bg-destructive/5 border-destructive/20' : 'bg-success/5 border-success/20'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Month Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              You spent <strong className={spendingChange > 0 ? 'text-destructive' : 'text-success'}>
                {Math.abs(spendingChange)}% {spendingChange > 0 ? 'more' : 'less'}
              </strong> than last month. 
              {spendingChange > 0 ? ' Try to cut back to stay on track.' : ' Great job keeping expenses low!'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your average daily spending is <strong className="text-accent">{formatCurrency(summary?.dailyAverage || 0)}</strong>. 
              At this rate, you'll spend {formatCurrency((summary?.dailyAverage || 0) * 30)} this month.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
            <CardDescription>Your spending over the past months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
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
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Distribution of your expenses.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
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
            
            <div className="w-full mt-6 grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.name} className="flex flex-col text-sm border p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[cat.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other }} 
                    />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <span className="text-muted-foreground">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
