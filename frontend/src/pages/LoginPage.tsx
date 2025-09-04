import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuth } from '@contexts/AuthContext';
import { Input } from '@components/atoms/Input';
import { Button } from '@components/atoms/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import GradientBlob from '@components/ui/GradientBlob';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters')
});

type LoginForm = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background with animated blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <GradientBlob size="xl" color="primary" className="absolute -top-32 -left-32" />
        <GradientBlob size="lg" color="secondary" className="absolute top-1/2 -right-24" />
        <GradientBlob size="md" color="accent" className="absolute -bottom-16 left-1/3" />
      </div>

      {/* Left side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12"
      >
        <div className="max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl gradient-text">
                Franky Mail
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Email marketing that converts
              </p>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="font-display font-bold text-4xl text-neutral-900 dark:text-neutral-100 mb-4"
          >
            Welcome back to the future of email marketing
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 mb-8"
          >
            Create stunning campaigns that your audience will love. 
            Join thousands of marketers who've made the switch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-500 rounded-full" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Drag & drop email builder
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary-500 rounded-full" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Advanced analytics & insights
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-neutral-600 dark:text-neutral-400">
                AI-powered optimization
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="glass dark:glass-dark rounded-3xl p-8 shadow-glass">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                Sign in to your account
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Ready to create amazing campaigns?
              </p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Input
                  label="Username"
                  variant="floating"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.username?.message}
                  {...register('username')}
                  autoComplete="username"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Input
                  label="Password"
                  type="password"
                  variant="floating"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                  autoComplete="current-password"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Sign In
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full opacity-20 float" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full opacity-30 float" style={{ animationDelay: '2s' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;