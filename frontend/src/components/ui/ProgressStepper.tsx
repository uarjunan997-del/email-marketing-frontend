import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  completedSteps
}) => {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-8">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = currentStep === index;
        const isUpcoming = index > currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <motion.div
                className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 relative z-10',
                  isCompleted && 'bg-gradient-to-r from-accent-500 to-accent-600 border-accent-500',
                  isCurrent && 'bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500',
                  isUpcoming && 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <span className={clsx(
                    'font-semibold text-sm',
                    isCurrent && 'text-white',
                    isUpcoming && 'text-neutral-500 dark:text-neutral-400'
                  )}>
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step Info */}
              <div className="mt-3 text-center">
                <p className={clsx(
                  'text-sm font-medium',
                  (isCompleted || isCurrent) && 'text-neutral-900 dark:text-neutral-100',
                  isUpcoming && 'text-neutral-500 dark:text-neutral-400'
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-24">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 relative">
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ 
                    scaleX: completedSteps.includes(index) ? 1 : 0 
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepper;