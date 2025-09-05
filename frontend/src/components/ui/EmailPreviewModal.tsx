import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Tablet, Monitor, Eye } from 'lucide-react';
import { Button } from '../atoms/Button';
import clsx from 'clsx';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  subject: string;
  preheader?: string;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const deviceConfigs = {
  mobile: {
    icon: <Smartphone className="w-4 h-4" />,
    label: 'Mobile',
    width: 375,
    height: 667,
    className: 'w-[375px] h-[667px]'
  },
  tablet: {
    icon: <Tablet className="w-4 h-4" />,
    label: 'Tablet',
    width: 768,
    height: 1024,
    className: 'w-[600px] h-[800px]'
  },
  desktop: {
    icon: <Monitor className="w-4 h-4" />,
    label: 'Desktop',
    width: 1200,
    height: 800,
    className: 'w-full h-[600px] max-w-4xl'
  }
};

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  htmlContent,
  subject,
  preheader
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-7xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                  Email Preview
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {subject}
                </p>
              </div>
            </div>

            {/* Device Selector */}
            <div className="flex items-center gap-2">
              {Object.entries(deviceConfigs).map(([device, config]) => (
                <Button
                  key={device}
                  variant={selectedDevice === device ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDevice(device as DeviceType)}
                  icon={config.icon}
                >
                  {config.label}
                </Button>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={<X className="w-4 h-4" />}
                className="ml-2"
              />
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-6 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center min-h-[500px]">
            <motion.div
              key={selectedDevice}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={clsx(
                'bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden relative',
                deviceConfigs[selectedDevice].className
              )}
            >
              {/* Device Frame for Mobile/Tablet */}
              {selectedDevice !== 'desktop' && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
                  {selectedDevice === 'mobile' && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 rounded-full" />
                  )}
                </div>
              )}

              {/* Email Header */}
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    F
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                      Franky Mail
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      hello@frankymail.com
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {subject}
                </h3>
                {preheader && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {preheader}
                  </p>
                )}
              </div>

              {/* Email Content */}
              <div className="flex-1 overflow-auto">
                <iframe
                  srcDoc={htmlContent}
                  className="w-full h-full border-none"
                  style={{ 
                    minHeight: selectedDevice === 'desktop' ? '500px' : '400px'
                  }}
                  title="Email Preview"
                />
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Preview shows how your email will appear across different devices
            </div>
            <Button onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmailPreviewModal;