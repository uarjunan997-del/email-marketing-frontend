import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import ImportWizard from '@components/contacts/ImportWizard';
import { ArrowLeft, Upload } from 'lucide-react';

export const ImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [showWizard, setShowWizard] = useState(false);

  const handleComplete = () => {
    navigate('/contacts');
  };

  const handleCancel = () => {
    if (showWizard) {
      setShowWizard(false);
    } else {
      navigate('/contacts');
    }
  };

  if (showWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="ghost"
              onClick={handleCancel}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <div>
              <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100">
                Import Contacts
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Upload and map your contact data
              </p>
            </div>
          </motion.div>

          <ImportWizard onComplete={handleComplete} onCancel={handleCancel} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100 mb-2">
            Import Contacts
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Upload your contact list and start engaging with your audience
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/contacts')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Contacts
        </Button>
      </motion.div>

      {/* Import Options */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card hover variant="gradient" className="h-full cursor-pointer" onClick={() => setShowWizard(true)}>
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-3">
                Upload CSV File
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Import contacts from a CSV file with advanced mapping and deduplication options
              </p>
              <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Visual column mapping</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Real-time progress tracking</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Duplicate handling strategies</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card variant="gradient" className="h-full">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-3">
                API Integration
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Connect your existing systems and automatically sync contact data
              </p>
              <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>REST API endpoints</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Webhook notifications</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Real-time synchronization</span>
                </div>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Import Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card variant="glass">
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4">
            Import Guidelines
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                File Requirements
              </h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>• CSV format with headers in the first row</li>
                <li>• Email column is required</li>
                <li>• Maximum 100,000 contacts per file</li>
                <li>• File size limit: 50MB</li>
                <li>• UTF-8 encoding recommended</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                Best Practices
              </h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>• Clean your data before importing</li>
                <li>• Use consistent formatting</li>
                <li>• Include as much contact information as possible</li>
                <li>• Test with a small file first</li>
                <li>• Review mapping carefully before importing</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ImportPage;