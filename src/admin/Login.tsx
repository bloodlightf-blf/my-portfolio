// 后台登录页：react-hook-form + zod 校验，登录成功后保存 token 并跳转。
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  username: z.string().min(1, '请输入账号'),
  password: z.string().min(6, '密码至少 6 位'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  // 已登录则直接进入后台
  useEffect(() => {
    if (isAuthenticated) navigate('/admin/settings', { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: LoginForm) => {
    setError('');
    try {
      await login(values);
      navigate('/admin/settings', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-center text-2xl font-bold">后台登录</h1>
          <p className="mt-2 text-center text-sm text-slate-500">Portfolio 管理后台</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="label" htmlFor="username">
                账号
              </label>
              <input
                id="username"
                type="text"
                className="input"
                placeholder="admin"
                autoComplete="username"
                {...register('username')}
              />
              {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="password">
                密码
              </label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••"
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? '登录中...' : '登录'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600">默认账号：admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
