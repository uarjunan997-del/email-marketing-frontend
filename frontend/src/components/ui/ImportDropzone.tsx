import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Download,
  Users
} from 'lucide-react';

interface ImportDropzoneProps {
  onFileSelect: (file: File) => void;
  onUpload: (file: File, mapping?: string) => Promise<void>;
  loading?: boolean;
  progress?: number;
  error?: string;
}

export const ImportDropzone: React.FC<ImportDropzoneProps> = ({
  onFileSelect,
  onUpload,
  loading,
  progress,
  error
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile, mapping || undefined);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMapping('');
  };

  const sampleMapping = `{
  "email": "Email",
  "firstName": "First Name", 
  "lastName": "Last Name",
  "segment": "Segment",
  "phone": "Phone"
}`;

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <motion.div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive || dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 scale-105'
            : selectedFile
            ? 'border-accent-300 bg-accent-50 dark:bg-accent-950/20'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/10'
        }`}
        whileHover={{ scale: selectedFile ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-1">
                  File Ready to Upload
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mx-auto"
                >
                  <X className="w-3 h-3" />
                  Remove file
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Processing contacts...
                  </p>
                  {progress !== undefined && (
                    <div className="w-48 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mx-auto">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Column mapping */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
              Column Mapping (Optional)
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMapping(sampleMapping)}
              icon={<Download className="w-3 h-3" />}
            >
              Use Sample
            </Button>
          </div>
          
          <textarea
            value={mapping}
            onChange={(e) => setMapping(e.target.value)}
            placeholder="Enter JSON mapping for columns (optional)"
            className="w-full h-32 px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-sm font-mono resize-none focus-ring"
          />
          
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            <p className="mb-1">Example mapping:</p>
            <code className="block bg-neutral-100 dark:bg-neutral-800 p-2 rounded text-xs">
              {sampleMapping}
            </code>
          </div>
        </motion.div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload button */}
      {selectedFile && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleUpload}
            size="lg"
            icon={<Upload className="w-4 h-4" />}
            className="px-8"
          >
            Upload Contacts
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ImportDropzone;