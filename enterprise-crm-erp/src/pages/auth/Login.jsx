import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/common/Button';

// Zod Schema 校验
const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(6, '密码至少6位'),
});

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('root', { message: '用户名或密码错误 (试用 admin/123456)' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">企业 ERP 系统</h2>
          <p className="mt-2 text-sm text-gray-600">请使用企业账号登录</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">账号</label>
              <input 
                {...register('username')}
                type="text" 
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input 
                {...register('password')}
                type="password" 
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          {errors.root && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm text-center">
              {errors.root.message}
            </div>
          )}

          <div>
            <Button type="submit" className="w-full py-2.5" isLoading={isSubmitting}>
              立即登录
            </Button>
          </div>
        </form>
        
        <div className="text-center text-xs text-gray-400">
          演示账号: admin / 密码: 任意6位
        </div>
      </div>
    </div>
  );
};

export default Login;