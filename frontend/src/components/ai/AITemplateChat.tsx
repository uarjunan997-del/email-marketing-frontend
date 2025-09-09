import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/atoms/Button';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { AssetUpload } from '@api/ai';
import { 
  Send, 
  Sparkles, 
  Wand2, 
  Image,
  Zap,
  Lightbulb,
  Palette,
  Mail
} from 'lucide-react';

interface AITemplateChatProps {
  assets: AssetUpload[];
  onGenerate: (prompt: string, templateType: string, style: string) => void;
  loading?: boolean;
  suggestions?: string[];
}

const templateTypes = [
  { id: 'newsletter', label: 'Newsletter', icon: <Mail className="w-4 h-4" />, description: 'Regular updates and content' },
  { id: 'promotional', label: 'Promotional', icon: <Zap className="w-4 h-4" />, description: 'Sales and offers' },
  { id: 'welcome', label: 'Welcome', icon: <Sparkles className="w-4 h-4" />, description: 'Onboarding series' },
  { id: 'transactional', label: 'Transactional', icon: <Wand2 className="w-4 h-4" />, description: 'Receipts and confirmations' }
];

const styleOptions = [
  { id: 'modern', label: 'Modern', description: 'Clean, minimal, contemporary' },
  { id: 'bold', label: 'Bold', description: 'Vibrant colors, strong typography' },
  { id: 'classic', label: 'Classic', description: 'Traditional, professional' },
  { id: 'minimal', label: 'Minimal', description: 'Simple, focused, elegant' }
];

const quickPrompts = [
  "Create a welcome email with my logo prominently displayed in the header",
  "Design a promotional newsletter using my background image as a hero section",
  "Build a product announcement email incorporating all my uploaded assets",
  "Generate a modern newsletter template with my logo and content images",
  "Create a sales email with my background image and call-to-action buttons"
];

export const AITemplateChat: React.FC<AITemplateChatProps> = ({
  assets,
  onGenerate,
  loading,
  suggestions = []
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState('newsletter');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const assetSummary = {
    logo: assets.filter(a => a.type === 'logo').length,
    background: assets.filter(a => a.type === 'background').length,
    content: assets.filter(a => a.type === 'content').length
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, selectedType, selectedStyle);
    }
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Wand2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
          AI Template Generator
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Describe your vision and our AI will create a stunning email template using your assets
        </p>
      </motion.div>

      {/* Asset Summary */}
      {assets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card variant="gradient" className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Image className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                Assets Ready for Integration
              </span>
            </div>
            <div className="flex items-center justify-center gap-4">
              {assetSummary.logo > 0 && (
                <Badge variant="primary" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {assetSummary.logo} Logo{assetSummary.logo > 1 ? 's' : ''}
                </Badge>
              )}
              {assetSummary.background > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Image className="w-3 h-3" />
                  {assetSummary.background} Background{assetSummary.background > 1 ? 's' : ''}
                </Badge>
              )}
              {assetSummary.content > 0 && (
                <Badge variant="accent" className="flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  {assetSummary.content} Content Image{assetSummary.content > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Prompts */}
      {assets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Quick Suggestions
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {quickPrompts.slice(0, 4).map((quickPrompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickPrompt(quickPrompt)}
                  className="p-3 text-left bg-neutral-50 dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-xl transition-all duration-200 border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
                >
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {quickPrompt}
                  </p>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="gradient">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Type Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Template Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {templateTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedType === type.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedType === type.id 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {type.icon}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                          {type.label}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Design Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {styleOptions.map((style) => (
                  <motion.button
                    key={style.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedStyle === style.id
                        ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-950/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-secondary-300'
                    }`}
                  >
                    <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                      {style.label}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {style.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Describe Your Template Vision
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={assets.length > 0 
                    ? "Describe how you want to use your uploaded assets in the email template..."
                    : "Upload some assets first, then describe your template vision..."
                  }
                  className="w-full min-h-[120px] max-h-[300px] px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none"
                  disabled={assets.length === 0}
                />
                
                {/* Character count */}
                <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
                  {prompt.length}/500
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={!prompt.trim() || assets.length === 0 || loading}
                loading={loading}
                size="lg"
                icon={<Wand2 className="w-5 h-5" />}
                className="px-8"
              >
                {loading ? 'Generating Template...' : 'Generate Template'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent-500" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                AI Suggestions
              </h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleQuickPrompt(suggestion)}
                  className="w-full p-3 text-left bg-accent-50 dark:bg-accent-950/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 rounded-lg transition-all duration-200 border border-accent-200 dark:border-accent-800"
                >
                  <p className="text-sm text-accent-800 dark:text-accent-200">
                    {suggestion}
                  </p>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <Card variant="gradient" className="text-center max-w-md mx-4">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto shadow-glow">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Wand2 className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-2">
                    Creating Your Template
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Our AI is designing a beautiful email template with your assets...
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="w-2 h-2 bg-primary-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITemplateChat;