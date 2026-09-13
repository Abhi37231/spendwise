import { useState } from 'react';
import { useForm } from 'react-form'; // Note: Will use react-hook-form properly
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useForm as useRHForm } from 'react-hook-form';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRHForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      setLoading(true);
      const response = await api.post('/auth/login', data);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">S</span>
              </div>
              <span className="text-xl font-bold">SpendWise</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="remember" className="rounded border-input text-primary focus:ring-primary" />
              <Label htmlFor="remember" className="font-normal text-muted-foreground cursor-pointer">Remember me</Label>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
