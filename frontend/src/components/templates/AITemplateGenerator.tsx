import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import AssetUploadPanel from '@components/ai/AssetUploadPanel';
import AITemplateChat from '@components/ai/AITemplateChat';
import TemplatePreview from '@components/ai/TemplatePreview';
import AssetLibrary from '@components/ai/AssetLibrary';
import { AssetUpload, generateTemplateWithAssets, GeneratedTemplate, getAssetSuggestions } from '@api/ai';
import { saveTemplate } from '@api/templates';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Wand2,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

type Step = 'upload' | 'generate' | 'preview' | 'library';

export const AITemplateGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [assets, setAssets] = useState<AssetUpload[]>([]);
  const [generatedTemplate, setGeneratedTemplate] = useState<GeneratedTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAssetsChange = useCallback(async (newAssets: AssetUpload[]) => {
    setAssets(newAssets);
    
    // Get AI suggestions based on uploaded assets
    if (newAssets.length > 0) {
      try {
        const assetSuggestions = await getAssetSuggestions(newAssets);
        setSuggestions(assetSuggestions);
      } catch (error) {
        console.error('Failed to get asset suggestions:', error);
      }
    }
  }, []);

  const handleGenerateTemplate = useCallback(async (prompt: string, templateType: string, style: string) => {
    if (assets.length === 0) {
      toast.error('Please upload at least one asset before generating a template');
      return;
    }

    setLoading(true);
    try {
      const response = await generateTemplateWithAssets({
        prompt,
        templateType: templateType as any,
        style: style as any,
        assets
      });

      setGeneratedTemplate(response.template);
      setCurrentStep('preview');
      toast.success('Template generated successfully! 🎉');
    } catch (error) {
      toast.error('Failed to generate template. Please try again.');
      console.error('Template generation error:', error);
    } finally {
      setLoading(false);
    }
  }, [assets]);

  const handleSaveTemplate = async () => {
    if (!generatedTemplate) return;

    try {
      const saved = await saveTemplate({
        name: generatedTemplate.metadata.title,
        subject: generatedTemplate.metadata.title,
        design: { html: generatedTemplate.html, css: generatedTemplate.css },
        html: generatedTemplate.html,
        tags: ['ai-generated', 'with-assets']
      });

      toast.success('Template saved to your library!');
      navigate(`/templates/${saved.id}`);
    } catch (error) {
      toast.error('Failed to save template');
      console.error('Save error:', error);
    }
  };

  const handleEditTemplate = () => {
    if (!generatedTemplate) return;
    
    // Save as draft and open in editor
    handleSaveTemplate();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <AssetUploadPanel
            assets={assets}
            onAssetsChange={handleAssetsChange}
            onGenerateTemplate={() => setCurrentStep('generate')}
            loading={loading}
          />
        );

      case 'generate':
        return (
          <AITemplateChat
            assets={assets}
            onGenerate={handleGenerateTemplate}
            loading={loading}
            suggestions={suggestions}
          />
        );

      case 'preview':
        return generatedTemplate ? (
          <TemplatePreview
            template={generatedTemplate}
            onEdit={handleEditTemplate}
            onSave={handleSaveTemplate}
            onRegenerate={() => setCurrentStep('generate')}
            loading={loading}
          />
        ) : null;

      case 'library':
        return (
          <AssetLibrary
            assets={assets}
            onAssetsChange={setAssets}
            selectable={false}
          />
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'upload': return 'Upload Assets';
      case 'generate': return 'Generate Template';
      case 'preview': return 'Preview & Save';
      case 'library': return 'Asset Library';
      default: return 'AI Template Generator';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'upload': return assets.length > 0;
      case 'generate': return true;
      case 'preview': return generatedTemplate !== null;
      case 'library': return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-6">
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
              onClick={() => navigate('/templates')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Templates
            </Button>
            <div>
              <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100">
                AI Template Generator
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Create stunning email templates with your brand assets
              </p>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex items-center gap-2">
            {(['upload', 'generate', 'preview', 'library'] as const).map((step) => (
              <Button
                key={step}
                variant={currentStep === step ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentStep(step)}
                disabled={step === 'preview' && !generatedTemplate}
                icon={
                  step === 'upload' ? <ImageIcon className="w-4 h-4" /> :
                  step === 'generate' ? <Wand2 className="w-4 h-4" /> :
                  step === 'preview' ? <Sparkles className="w-4 h-4" /> :
                  <Zap className="w-4 h-4" />
                }
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="glass" padding="sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {getStepTitle()}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Step {(['upload', 'generate', 'preview', 'library'].indexOf(currentStep) + 1)} of 4
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {assets.length > 0 && (
                  <Badge variant="accent" className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {assets.length} Asset{assets.length > 1 ? 's' : ''}
                  </Badge>
                )}
                {generatedTemplate && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Template Ready
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AITemplateGenerator;