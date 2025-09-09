import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/atoms/Button';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { GeneratedTemplate } from '@api/ai';
import { 
  Eye, 
  Download, 
  Edit, 
  Smartphone, 
  Tablet, 
  Monitor,
  Sparkles,
  Check,
  RefreshCw
} from 'lucide-react';

interface TemplatePreviewProps {
  template: GeneratedTemplate;
  onEdit: () => void;
  onSave: () => void;
  onRegenerate: () => void;
  loading?: boolean;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceConfigs = {
  desktop: {
    icon: <Monitor className="w-4 h-4" />,
    label: 'Desktop',
    width: '100%',
    maxWidth: '600px',
    className: 'w-full max-w-2xl'
  },
  tablet: {
    icon: <Tablet className="w-4 h-4" />,
    label: 'Tablet',
    width: '480px',
    maxWidth: '480px',
    className: 'w-[480px]'
  },
  mobile: {
    icon: <Smartphone className="w-4 h-4" />,
    label: 'Mobile',
    width: '320px',
    maxWidth: '320px',
    className: 'w-[320px]'
  }
};

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  onEdit,
  onSave,
  onRegenerate,
  loading
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [showAssetInfo, setShowAssetInfo] = useState(false);

  const deviceConfig = deviceConfigs[selectedDevice];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
            Generated Template Preview
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {template.metadata.title}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowAssetInfo(!showAssetInfo)}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Asset Info
          </Button>
          <Button
            variant="outline"
            onClick={onRegenerate}
            loading={loading}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Regenerate
          </Button>
        </div>
      </motion.div>

      {/* Asset Information */}
      <AnimatePresence>
        {showAssetInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card variant="glass">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Assets Used in Template
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {template.metadata.usedAssets.map((assetId, index) => (
                  <motion.div
                    key={assetId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-accent-50 dark:bg-accent-950/20 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {assetId}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Integrated successfully
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Device Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="glass" padding="sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                Preview Device
              </span>
            </div>
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
              {Object.entries(deviceConfigs).map(([device, config]) => (
                <motion.button
                  key={device}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDevice(device as DeviceType)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    selectedDevice === device
                      ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  {config.icon}
                  <span className="text-sm font-medium">{config.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Template Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <motion.div
          key={selectedDevice}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`${deviceConfig.className} relative`}
        >
          <Card variant="elevated" padding="none" className="overflow-hidden">
            {/* Device Frame */}
            {selectedDevice !== 'desktop' && (
              <div className="bg-neutral-800 p-2 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <div className="w-3 h-3 bg-accent-500 rounded-full" />
                  <div className="flex-1 bg-neutral-700 rounded-full h-6 flex items-center justify-center">
                    <span className="text-xs text-neutral-400">Email Preview</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Email Content */}
            <div className="bg-white dark:bg-neutral-900">
              <iframe
                srcDoc={`
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>${template.css}</style>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      ${template.html}
                    </body>
                  </html>
                `}
                className="w-full border-none"
                style={{ 
                  height: selectedDevice === 'mobile' ? '600px' : '700px',
                  maxWidth: deviceConfig.maxWidth
                }}
                title="Template Preview"
              />
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-4"
      >
        <Button
          variant="outline"
          onClick={onEdit}
          icon={<Edit className="w-4 h-4" />}
          size="lg"
        >
          Edit Template
        </Button>
        <Button
          onClick={onSave}
          icon={<Check className="w-4 h-4" />}
          size="lg"
        >
          Save Template
        </Button>
        <Button
          variant="ghost"
          icon={<Download className="w-4 h-4" />}
          size="lg"
        >
          Export HTML
        </Button>
      </motion.div>
    </div>
  );
};

export default TemplatePreview;