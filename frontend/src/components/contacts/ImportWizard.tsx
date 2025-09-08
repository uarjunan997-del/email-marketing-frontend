import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@components/atoms/Button';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { useImportProgress } from '@hooks/useWebSocket';
import { useAuth } from '@contexts/AuthContext';
import { uploadImport, ImportJob } from '@api/contacts';
import { 
  Upload, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  AlertCircle,
  Users,
  Zap,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ImportWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface CSVColumn {
  name: string;
  index: number;
  sample?: string;
}

interface FieldMapping {
  csvColumn: string;
  contactField: string;
}

const contactFields = [
  { key: 'email', label: 'Email Address', required: true },
  { key: 'firstName', label: 'First Name', required: false },
  { key: 'lastName', label: 'Last Name', required: false },
  { key: 'phone', label: 'Phone Number', required: false },
  { key: 'segment', label: 'Segment', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'country', label: 'Country', required: false }
];

const dedupeStrategies = [
  { value: 'MERGE', label: 'Merge', description: 'Update existing contacts with new data' },
  { value: 'SKIP', label: 'Skip', description: 'Skip contacts that already exist' },
  { value: 'OVERWRITE', label: 'Overwrite', description: 'Replace existing contacts completely' }
];

export const ImportWizard: React.FC<ImportWizardProps> = ({ onComplete, onCancel }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [dedupeStrategy, setDedupeStrategy] = useState('MERGE');
  const [importJob, setImportJob] = useState<ImportJob | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { progress } = useImportProgress(user?.id ? parseInt(user.id) : 0);

  const steps = [
    { title: 'Upload File', description: 'Select your CSV file' },
    { title: 'Map Columns', description: 'Match CSV columns to contact fields' },
    { title: 'Import Progress', description: 'Track import status' }
  ];

  // Step 1: File Upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      parseCSVHeaders(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const parseCSVHeaders = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const sampleRow = lines[1]?.split(',').map(h => h.trim().replace(/"/g, ''));
      
      const columns: CSVColumn[] = headers.map((name, index) => ({
        name,
        index,
        sample: sampleRow?.[index] || ''
      }));
      
      setCsvColumns(columns);
      
      // Auto-map common fields
      const autoMappings: FieldMapping[] = [];
      columns.forEach(col => {
        const lowerName = col.name.toLowerCase();
        if (lowerName.includes('email')) {
          autoMappings.push({ csvColumn: col.name, contactField: 'email' });
        } else if (lowerName.includes('first') && lowerName.includes('name')) {
          autoMappings.push({ csvColumn: col.name, contactField: 'firstName' });
        } else if (lowerName.includes('last') && lowerName.includes('name')) {
          autoMappings.push({ csvColumn: col.name, contactField: 'lastName' });
        } else if (lowerName.includes('phone')) {
          autoMappings.push({ csvColumn: col.name, contactField: 'phone' });
        } else if (lowerName.includes('segment')) {
          autoMappings.push({ csvColumn: col.name, contactField: 'segment' });
        }
      });
      
      setFieldMappings(autoMappings);
    };
    reader.readAsText(file.slice(0, 2048)); // Read first 2KB for headers
  };

  // Step 2: Column Mapping
  const updateMapping = (csvColumn: string, contactField: string) => {
    setFieldMappings(prev => {
      const existing = prev.find(m => m.csvColumn === csvColumn);
      if (existing) {
        return prev.map(m => 
          m.csvColumn === csvColumn 
            ? { ...m, contactField } 
            : m
        );
      } else {
        return [...prev, { csvColumn, contactField }];
      }
    });
  };

  const removeMapping = (csvColumn: string) => {
    setFieldMappings(prev => prev.filter(m => m.csvColumn !== csvColumn));
  };

  // Step 3: Import
  const startImport = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const mappingJson = JSON.stringify(
        fieldMappings.reduce((acc, mapping) => {
          acc[mapping.contactField] = mapping.csvColumn;
          return acc;
        }, {} as Record<string, string>)
      );

      const job = await uploadImport(selectedFile, mappingJson, dedupeStrategy);
      setImportJob(job);
      setCurrentStep(2);
      toast.success('Import started successfully!');
    } catch (error) {
      toast.error('Failed to start import');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderStep = () => {
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
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                Upload Contact File
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Select a CSV file containing your contact data
              </p>
            </div>

            <Card variant="gradient">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 scale-105'
                    : selectedFile
                    ? 'border-accent-300 bg-accent-50 dark:bg-accent-950/20'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/10'
                }`}
              >
                <input {...getInputProps()} />
                
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-1">
                        File Selected
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {selectedFile.name}
                        </span>
                        <Badge variant="info" size="sm">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                      <p className="text-sm text-accent-600 dark:text-accent-400">
                        Found {csvColumns.length} columns
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-2">
                        {isDragActive ? 'Drop your file here' : 'Upload Contact List'}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        Drag and drop your CSV file or click to browse
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                        <span>Supports:</span>
                        <Badge variant="outline" size="sm">CSV</Badge>
                        <Badge variant="outline" size="sm">XLS</Badge>
                        <Badge variant="outline" size="sm">XLSX</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* File Requirements */}
            <Card variant="glass" padding="md">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                File Requirements
              </h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-500" />
                  CSV format with headers in first row
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-500" />
                  Email column is required
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-500" />
                  Maximum 100,000 contacts per file
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-500" />
                  File size limit: 50MB
                </li>
              </ul>
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
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                Map Your Columns
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Match your CSV columns to contact fields
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* CSV Columns */}
              <Card variant="gradient">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4">
                  CSV Columns
                </h3>
                <div className="space-y-3">
                  {csvColumns.map((column) => {
                    const mapping = fieldMappings.find(m => m.csvColumn === column.name);
                    return (
                      <div
                        key={column.name}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          mapping 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' 
                            : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {column.name}
                          </span>
                          {mapping && (
                            <Badge variant="success" size="sm">
                              Mapped
                            </Badge>
                          )}
                        </div>
                        {column.sample && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                            Sample: {column.sample}
                          </p>
                        )}
                        <select
                          value={mapping?.contactField || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              updateMapping(column.name, e.target.value);
                            } else {
                              removeMapping(column.name);
                            }
                          }}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
                        >
                          <option value="">Select field...</option>
                          {contactFields.map(field => (
                            <option key={field.key} value={field.key}>
                              {field.label} {field.required && '*'}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Contact Fields */}
              <Card variant="gradient">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4">
                  Contact Fields
                </h3>
                <div className="space-y-3">
                  {contactFields.map((field) => {
                    const mapping = fieldMappings.find(m => m.contactField === field.key);
                    return (
                      <div
                        key={field.key}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          mapping 
                            ? 'border-accent-500 bg-accent-50 dark:bg-accent-950/20' 
                            : field.required
                            ? 'border-red-300 bg-red-50 dark:bg-red-950/20'
                            : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-neutral-900 dark:text-neutral-100">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </span>
                            {mapping && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                Mapped to: {mapping.csvColumn}
                              </p>
                            )}
                          </div>
                          {mapping ? (
                            <Badge variant="success" size="sm">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mapped
                            </Badge>
                          ) : field.required ? (
                            <Badge variant="danger" size="sm">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Required
                            </Badge>
                          ) : (
                            <Badge variant="default" size="sm">
                              Optional
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Dedupe Strategy */}
            <Card variant="glass">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                Duplicate Handling Strategy
              </h4>
              <div className="grid gap-3 sm:grid-cols-3">
                {dedupeStrategies.map((strategy) => (
                  <label
                    key={strategy.value}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      dedupeStrategy === strategy.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dedupeStrategy"
                      value={strategy.value}
                      checked={dedupeStrategy === strategy.value}
                      onChange={(e) => setDedupeStrategy(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                        {strategy.label}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {strategy.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>
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
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                Import in Progress
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Your contacts are being processed
              </p>
            </div>

            {progress && (
              <Card variant="gradient">
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Processing Progress
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {Math.round((progress.processed_rows / progress.total_rows) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.round((progress.processed_rows / progress.total_rows) * 100)}%` 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-accent-50 dark:bg-accent-950/20 rounded-xl">
                      <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                        {progress.processed_rows || 0}
                      </div>
                      <div className="text-sm text-accent-700 dark:text-accent-300 flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Processed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {progress.failed_rows || 0}
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300 flex items-center justify-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Failed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {progress.total_rows || 0}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center gap-1">
                        <Users className="w-4 h-4" />
                        Total
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <Badge 
                      variant={
                        progress.status === 'COMPLETED' ? 'success' :
                        progress.status === 'FAILED' ? 'danger' :
                        'info'
                      }
                      className="text-sm px-4 py-2"
                    >
                      {progress.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedFile && csvColumns.length > 0;
      case 1:
        return fieldMappings.some(m => m.contactField === 'email');
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      startImport();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index <= currentStep
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'border-neutral-300 dark:border-neutral-700 text-neutral-400'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {step.title}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  index < currentStep
                    ? 'bg-primary-500'
                    : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={currentStep === 0 ? onCancel : handlePrevious}
          icon={<ArrowLeft className="w-4 h-4" />}
          disabled={currentStep === 2}
        >
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        {currentStep < 2 && (
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isUploading}
            loading={isUploading}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            {currentStep === 1 ? 'Start Import' : 'Continue'}
          </Button>
        )}

        {currentStep === 2 && progress?.status === 'COMPLETED' && (
          <Button
            onClick={onComplete}
            icon={<CheckCircle className="w-4 h-4" />}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportWizard;