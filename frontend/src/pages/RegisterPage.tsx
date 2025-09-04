import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@contexts/AuthContext';
import { FormField } from '@components/molecules/FormField';
import { Button } from '@components/atoms/Button';
import { Link, useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

type RegisterForm = z.infer<typeof schema>;

export const RegisterPage: React.FC = () => {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<RegisterForm>({resolver: zodResolver(schema)});
  const onSubmit = async (data:RegisterForm) => { await doRegister(data.email, data.password, data.firstName, data.lastName); navigate('/dashboard'); };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-950">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold text-center">Create Account</h1>
        <FormField label="Email" errorObj={errors.email} {...register('email')} autoComplete="email" />
        <FormField label="Password" type="password" errorObj={errors.password} {...register('password')} autoComplete="new-password" />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First Name" errorObj={errors.firstName} {...register('firstName')} />
          <FormField label="Last Name" errorObj={errors.lastName} {...register('lastName')} />
        </div>
        <Button type="submit" className="w-full" loading={isSubmitting}>Register</Button>
        <p className="text-center text-xs text-gray-500">Have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">Login</Link></p>
      </form>
    </div>
  );
};

export default RegisterPage;
