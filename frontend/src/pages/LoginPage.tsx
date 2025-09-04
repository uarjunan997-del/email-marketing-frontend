import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@contexts/AuthContext';
import { FormField } from '@components/molecules/FormField';
import { Button } from '@components/atoms/Button';
import { Link, useNavigate } from 'react-router-dom';

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(4)
});

type LoginForm = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<LoginForm>({resolver: zodResolver(schema)});
  const onSubmit = async (data:LoginForm) => { await login(data.username, data.password); navigate('/dashboard'); };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-950">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold text-center">Login</h1>
        <FormField label="Username" errorObj={errors.username} {...register('username')} autoComplete="username" />
        <FormField label="Password" type="password" errorObj={errors.password} {...register('password')} autoComplete="current-password" />
        <Button type="submit" className="w-full" loading={isSubmitting}>Sign In</Button>
        <p className="text-center text-xs text-gray-500">No account? <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">Register</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
