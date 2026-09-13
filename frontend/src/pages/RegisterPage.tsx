import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      setLoading(true);
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasLength = passwordValue.length >= 8;
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden py-12">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
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
            <h1 className="text-2xl font-bold tracking-tight mb-2">Create an account</h1>
            <p className="text-sm text-muted-foreground">Start taking control of your money today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

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
              <Label htmlFor="password">Password</Label>
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

              {/* Password strength indicator */}
              {passwordValue.length > 0 && (
                <div className="text-xs mt-2 space-y-1">
                  <div className={`flex items-center gap-1 ${hasLength ? 'text-success' : 'text-muted-foreground'}`}>
                    {hasLength ? <Check size={12} /> : <X size={12} />} Minimum 8 characters
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                    {hasNumber ? <Check size={12} /> : <X size={12} />} At least one number
                  </div>
                  <div className={`flex items-center gap-1 ${hasSpecial ? 'text-success' : 'text-muted-foreground'}`}>
                    {hasSpecial ? <Check size={12} /> : <X size={12} />} At least one special character
                  </div>
                </div>
              )}
              
              {errors.password && !passwordValue && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
