import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuth } from '@contexts/AuthContext';
import { Input } from '@components/atoms/Input';
import { Button } from '@components/atoms/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap, ArrowRight, Sparkles } from 'lucide-react';
import GradientBlob from '@components/ui/GradientBlob';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional()
});

type RegisterForm = z.infer<typeof schema>;

export const RegisterPage: React.FC = () => {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await doRegister(data.username, data.email, data.password, data.firstName, data.lastName);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background with animated blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <GradientBlob size="xl" color="secondary" className="absolute -top-32 -right-32" />
        <GradientBlob size="lg" color="accent" className="absolute top-1/3 -left-24" />
        <GradientBlob size="md" color="primary" className="absolute -bottom-16 right-1/3" />
      </div>

      {/* Left side - Registration form */}
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
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-display font-bold text-xl gradient-text">
                  Franky Mail
                </h1>
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                Start your email journey
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Join thousands of marketers creating amazing campaigns
              </p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Input
                  label="Username"
                  variant="floating"
                  icon={<User className="w-4 h-4" />}
                  error={errors.username?.message}
                  {...register('username')}
                  autoComplete="username"
                />
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Input
                    label="First Name"
                    variant="floating"
                    icon={<User className="w-4 h-4" />}
                    error={errors.firstName?.message}
                    {...register('firstName')}
                    autoComplete="given-name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Input
                    label="Last Name"
                    variant="floating"
                    icon={<User className="w-4 h-4" />}
                    error={errors.lastName?.message}
                    {...register('lastName')}
                    autoComplete="family-name"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Input
                  label="Email Address"
                  type="email"
                  variant="floating"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                  autoComplete="email"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Input
                  label="Password"
                  type="password"
                  variant="floating"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                  autoComplete="new-password"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Create Account
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Features showcase */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12"
      >
        <div className="max-w-md ml-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100 mb-8"
          >
            Why marketers love Franky Mail
          </motion.h3>

          <div className="space-y-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Lightning Fast',
                description: 'Build beautiful emails in minutes, not hours'
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI-Powered',
                description: 'Smart suggestions and optimization recommendations'
              },
              {
                icon: <Mail className="w-6 h-6" />,
                title: 'High Deliverability',
                description: '99.9% inbox delivery rate with our premium infrastructure'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-white/20 dark:border-neutral-800/20"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;