import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import ProgressStepper from '@components/ui/ProgressStepper';
import RecipientVisualizer from '@components/ui/RecipientVisualizer';
import SmartScheduler from '@components/ui/SmartScheduler';
import EmailPreviewModal from '@components/ui/EmailPreviewModal';
import ConfettiAnimation from '@components/ui/ConfettiAnimation';

import { createCampaign, CreateCampaignInput } from '@api/campaigns';
import { useTemplateManager } from '@hooks/useTemplateManager';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  Users, 
  Calendar, 
  Eye,
  FileText,
  Target,
  Sparkles
} from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Campaign name must be at least 2 characters'),
  subject: z.string().min(1, 'Subject line is required'),
  preheader: z.string().optional(),
  segment: z.string().optional(),
  templateId: z.number().optional()
});

type CampaignForm = z.infer<typeof schema>;

const steps = [
  {
    id: 'basics',
    title: 'Campaign Basics',
    description: 'Name and content'
  },
  {
    id: 'audience',
    title: 'Target Audience',
    description: 'Who to send to'
  },
  {
    id: 'schedule',
    title: 'Schedule & Send',
    description: 'When to deliver'
  }
];

export const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const { templates } = useTemplateManager();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [recipientCount, setRecipientCount] = useState(2847);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CampaignForm>({
    resolver: zodResolver(schema)
  });

  const watchedValues = watch();

  // Mock recipient count calculation based on segment
  useEffect(() => {
    const segment = watchedValues.segment;
    if (segment) {
      // Simulate API call to get recipient count
      const counts: Record<string, number> = {
        'all': 2847,
        'new-subscribers': 1234,
        'active-users': 1876,
        'vip-customers': 456
      };
      setRecipientCount(counts[segment] || 2847);
    }
  }, [watchedValues.segment]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSchedule = async (scheduledAt: Date) => {
    setIsCreating(true);
    try {
      const campaignData: CreateCampaignInput = {
        name: watchedValues.name,
        subject: watchedValues.subject,
        preheader: watchedValues.preheader,
        segment: watchedValues.segment,
        templateId: watchedValues.templateId,
        scheduledAt: scheduledAt.toISOString()
      };

      await createCampaign(campaignData);
      setShowConfetti(true);
      toast.success('Campaign scheduled successfully! 🎉');
      
      setTimeout(() => {
        navigate('/campaigns');
      }, 2000);
    } catch (error) {
      toast.error('Failed to schedule campaign');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendNow = async () => {
    setIsCreating(true);
    try {
      const campaignData: CreateCampaignInput = {
        name: watchedValues.name,
        subject: watchedValues.subject,
        preheader: watchedValues.preheader,
        segment: watchedValues.segment,
        templateId: watchedValues.templateId
      };

      await createCampaign(campaignData);
      setShowConfetti(true);
      toast.success('Campaign sent successfully! 🚀');
      
      setTimeout(() => {
        navigate('/campaigns');
      }, 2000);
    } catch (error) {
      toast.error('Failed to send campaign');
    } finally {
      setIsCreating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                Campaign Basics
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Let's start with the essentials for your email campaign
              </p>
            </div>

            <Card variant="gradient" className="space-y-6">
              <Input
                label="Campaign Name"
                placeholder="e.g., Summer Sale 2024"
                error={errors.name?.message}
                icon={<FileText className="w-4 h-4" />}
                {...register('name')}
              />

              <Input
                label="Subject Line"
                placeholder="e.g., Don't miss our biggest sale of the year!"
                error={errors.subject?.message}
                icon={<Mail className="w-4 h-4" />}
                {...register('subject')}
              />

              <Input
                label="Preheader Text (Optional)"
                placeholder="e.g., Up to 50% off everything - limited time only"
                error={errors.preheader?.message}
                icon={<Eye className="w-4 h-4" />}
                {...register('preheader')}
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {templates.slice(0, 4).map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setValue('templateId', parseInt(template.id));
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {template.name}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {template.subject}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                Target Audience
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Choose who will receive your campaign
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card variant="gradient">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  Select Audience
                </h3>
                
                <div className="space-y-3">
                  {[
                    { value: 'all', label: 'All Subscribers', count: '2,847 contacts' },
                    { value: 'new-subscribers', label: 'New Subscribers', count: '1,234 contacts' },
                    { value: 'active-users', label: 'Active Users', count: '1,876 contacts' },
                    { value: 'vip-customers', label: 'VIP Customers', count: '456 contacts' }
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        watchedValues.segment === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value={option.value}
                          {...register('segment')}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {option.label}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {option.count}
                          </p>
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </Card>

              <RecipientVisualizer
                count={recipientCount}
                segment={watchedValues.segment}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                Schedule & Send
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Choose when to deliver your campaign for maximum impact
              </p>
            </div>

            <SmartScheduler
              onSchedule={handleSchedule}
              onSendNow={handleSendNow}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-6">
      <ConfettiAnimation 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/campaigns')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Campaigns
            </Button>
            <div>
              <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100">
                Create New Campaign
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Build and schedule your email campaign in just a few steps
              </p>
            </div>
          </div>

          {selectedTemplate && (
            <Button
              variant="outline"
              onClick={() => setPreviewOpen(true)}
              icon={<Eye className="w-4 h-4" />}
            >
              Preview Email
            </Button>
          )}
        </motion.div>

        {/* Progress Stepper */}
        <ProgressStepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Step Content */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentStep < steps.length - 1 && (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && (!watchedValues.name || !watchedValues.subject)) ||
                (currentStep === 1 && !watchedValues.segment)
              }
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Continue
            </Button>
          )}
        </motion.div>
      </div>

      {/* Email Preview Modal */}
      <EmailPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        htmlContent={selectedTemplate?.design?.html || '<p>Select a template to preview</p>'}
        subject={watchedValues.subject || 'Your Campaign Subject'}
        preheader={watchedValues.preheader}
      />
    </div>
  );
};

export default CreateCampaignPage;