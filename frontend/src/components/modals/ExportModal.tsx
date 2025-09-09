import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/atoms/Button';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { 
  Download, 
  X, 
  Check,
  FileText,
  Database,
  Calendar,
  Users,
  Mail,
  Phone,
  MapPin,
  Settings
} from 'lucide-react';

export interface ExportField {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: 'basic' | 'contact' | 'system' | 'custom';
  required?: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (fields: string[], format: 'csv' | 'xlsx') => void;
  availableFields: ExportField[];
  selectedCount?: number;
  loading?: boolean;
}

const defaultFields: ExportField[] = [
  { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, category: 'basic', required: true },
  { id: 'firstName', label: 'First Name', icon: <Users className="w-4 h-4" />, category: 'basic' },
  { id: 'lastName', label: 'Last Name', icon: <Users className="w-4 h-4" />, category: 'basic' },
  { id: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" />, category: 'contact' },
  { id: 'country', label: 'Country', icon: <MapPin className="w-4 h-4" />, category: 'contact' },
  { id: 'city', label: 'City', icon: <MapPin className="w-4 h-4" />, category: 'contact' },
  { id: 'segment', label: 'Segment', icon: <Database className="w-4 h-4" />, category: 'system' },
  { id: 'unsubscribed', label: 'Subscription Status', icon: <Settings className="w-4 h-4" />, category: 'system' },
  { id: 'createdAt', label: 'Created Date', icon: <Calendar className="w-4 h-4" />, category: 'system' },
  { id: 'updatedAt', label: 'Updated Date', icon: <Calendar className="w-4 h-4" />, category: 'system' }
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  availableFields = [],
  selectedCount,
  loading = false
}) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(['email', 'firstName', 'lastName']);
  const [format, setFormat] = useState<'csv' | 'xlsx'>('csv');
  
  const allFields = [...defaultFields, ...availableFields];
  const fieldsByCategory = {
    basic: allFields.filter(f => f.category === 'basic'),
    contact: allFields.filter(f => f.category === 'contact'),
    system: allFields.filter(f => f.category === 'system'),
    custom: allFields.filter(f => f.category === 'custom')
  };

  const toggleField = (fieldId: string) => {
    const field = allFields.find(f => f.id === fieldId);
    if (field?.required) return; // Can't deselect required fields

    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const selectAll = () => {
    setSelectedFields(allFields.map(f => f.id));
  };

  const selectBasicOnly = () => {
    setSelectedFields(fieldsByCategory.basic.map(f => f.id));
  };

  const handleExport = () => {
    if (selectedFields.length === 0) return;
    onExport(selectedFields, format);
  };

  const categoryIcons = {
    basic: <Users className="w-4 h-4" />,
    contact: <Phone className="w-4 h-4" />,
    system: <Database className="w-4 h-4" />,
    custom: <Settings className="w-4 h-4" />
  };

  const categoryLabels = {
    basic: 'Basic Information',
    contact: 'Contact Details',
    system: 'System Fields',
    custom: 'Custom Fields'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-xl text-neutral-900 dark:text-neutral-100">
                    Export Contacts
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {selectedCount ? `${selectedCount} selected contacts` : 'All contacts'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={<X className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Format Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                Export Format
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormat('csv')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    format === 'csv'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                  <div className="font-medium text-sm">CSV</div>
                  <div className="text-xs text-neutral-500">Excel compatible</div>
                </button>
                <button
                  onClick={() => setFormat('xlsx')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    format === 'xlsx'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <Database className="w-8 h-8 mx-auto mb-2 text-accent-500" />
                  <div className="font-medium text-sm">Excel</div>
                  <div className="text-xs text-neutral-500">Native format</div>
                </button>
              </div>
            </div>

            {/* Field Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                  Select Fields
                  <Badge variant="outline" size="sm" className="ml-2">
                    {selectedFields.length} selected
                  </Badge>
                </h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={selectBasicOnly}>
                    Basic Only
                  </Button>
                  <Button variant="ghost" size="sm" onClick={selectAll}>
                    Select All
                  </Button>
                </div>
              </div>

              {/* Field Categories */}
              {Object.entries(fieldsByCategory).map(([category, fields]) => {
                if (fields.length === 0) return null;

                return (
                  <Card key={category} variant="glass" padding="sm" className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      {categoryIcons[category as keyof typeof categoryIcons]}
                      <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {fields.map((field) => (
                        <motion.button
                          key={field.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleField(field.id)}
                          disabled={field.required}
                          className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                            selectedFields.includes(field.id)
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-300'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                          } ${
                            field.required ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedFields.includes(field.id)
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-neutral-300 dark:border-neutral-600'
                          }`}>
                            {selectedFields.includes(field.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          {field.icon}
                          <span className="text-sm font-medium flex-1">
                            {field.label}
                            {field.required && (
                              <Badge variant="outline" size="sm" className="ml-1 text-xs">
                                Required
                              </Badge>
                            )}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Exporting {selectedFields.length} fields as {format.toUpperCase()}
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={selectedFields.length === 0 || loading}
                  loading={loading}
                  icon={<Download className="w-4 h-4" />}
                >
                  Export
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportModal;
