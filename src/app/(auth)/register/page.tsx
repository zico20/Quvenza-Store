'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth.validator';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useLang } from '@/hooks/useLang';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const { t } = useLang();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setError('');
    try {
      const response = await auth.register({ name: data.name, email: data.email, password: data.password });
      if (response.success) {
        setUser(response.data.user);
        setTokens(response.data.tokens);
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.');
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-bg-surface border border-border rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-xl font-bold tracking-widest text-text-primary uppercase mb-1">
              {process.env.NEXT_PUBLIC_APP_NAME ?? 'Store'}
            </div>
            <h1 className="text-2xl font-bold text-text-primary mt-4">{t('auth.register.title')}</h1>
            <p className="text-text-muted text-sm mt-1">{t('auth.register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('auth.register.fullName')}</label>
              <input type="text" {...register('name')} className="input" placeholder="John Doe" />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('auth.register.email')}</label>
              <input type="email" {...register('email')} className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('auth.register.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('auth.register.confirm')}</label>
              <input type="password" {...register('confirmPassword')} className="input" placeholder="••••••••" />
              {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {error && (
              <div className="rounded-md px-4 py-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 mt-2">
              {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="divider" />
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
              <span className="px-3 text-text-muted text-xs" style={{ backgroundColor: '#111113' }}>or</span>
            </span>
          </div>

          <p className="text-center text-sm text-text-muted">
            {t('common.haveAccount')}{' '}
            <Link href="/login" className="text-accent hover:underline font-medium">{t('common.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
