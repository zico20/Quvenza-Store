'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminAuth } from '@/lib/admin/api';
import { useAdminAuthStore } from '@/store/admin/auth.store';
import { useLang } from '@/hooks/admin/useLang';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
type LoginInput = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAdminAuthStore();
  const { t } = useLang();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: LoginInput) {
    setError('');
    try {
      const r = await adminAuth.login(data);
      if (r.success) {
        if (r.data.user.role !== 'ADMIN') {
          setError('Access denied. Admin accounts only.');
          return;
        }
        setUser(r.data.user);
        setTokens(r.data.tokens);
        router.push('/admin/dashboard');
      } else {
        setError('Access denied.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="bg-bg-surface border border-border rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 rounded-xl bg-accent-subtle items-center justify-center mb-4">
              <span className="text-accent-text font-bold text-lg">A</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">Admin Login</h1>
            <p className="text-text-muted text-sm mt-1">Sign in to your dashboard</p>
          </div>

          {process.env.NODE_ENV !== 'production' && (
            <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 4, padding: '10px 14px', marginBottom: 20, fontSize: 12 }}>
              <div className="mono" style={{ color: '#2563EB', fontSize: 10, marginBottom: 4 }}>DEV CREDENTIALS</div>
              <div style={{ color: '#4B5563' }}>admin@softodeviqstore.com</div>
              <div style={{ color: '#4B5563', fontFamily: 'JetBrains Mono, monospace' }}>Admin@2026!</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input type="email" {...register('email')} className="input" placeholder="admin@mystore.com" />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <input type="password" {...register('password')} className="input" placeholder="••••••••" />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>
            {error && (
              <div className="rounded-md px-4 py-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-error text-sm">{error}</p>
              </div>
            )}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 mt-2">
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
