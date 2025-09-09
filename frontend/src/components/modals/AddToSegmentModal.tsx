import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { Card } from '@components/atoms/Card';
import { X, Users, Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { bulkAddToSegment } from '@api/contacts';

interface AddToSegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactIds: number[];
  availableSegments: string[];
  onSuccess: () => void;
}

export const AddToSegmentModal: React.FC<AddToSegmentModalProps> = ({
  isOpen,
  onClose,
  contactIds,
  availableSegments,
  onSuccess
}) => {
  const [selectedSegment, setSelectedSegment] = useState('');
  const [newSegmentName, setNewSegmentName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedSegment('');
      setNewSegmentName('');
      setIsCreatingNew(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const segment = isCreatingNew ? newSegmentName.trim() : selectedSegment;
    
    if (!segment) {
      toast.error('Please select or enter a segment name');
      return;
    }

    setLoading(true);
    try {
      const result = await bulkAddToSegment(contactIds, segment);
      toast.success(`${result.updated} contacts added to "${segment}" segment`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to add contacts to segment');
      console.error('Bulk add to segment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop - Completely Black Transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-black/90"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              type: "spring", 
              duration: 0.5, 
              bounce: 0.3 
            }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <div className="bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Add to Segment
                    </h2>
                    <p className="text-sm text-neutral-400">
                      Add {contactIds.length} contacts to a segment
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<X className="w-4 h-4" />}
                  className="text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg"
                />
              </div>

          {/* Segment Selection */}
          <div className="space-y-4">
            {/* Existing Segments */}
            {availableSegments.length > 0 && !isCreatingNew && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Select existing segment
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableSegments.map((segment) => (
                    <motion.button
                      key={segment}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSegment(segment)}
                      className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                        selectedSegment === segment
                          ? 'border-primary-500 bg-primary-500/20 text-primary-300 shadow-md'
                          : 'border-neutral-600 hover:border-primary-400 hover:bg-neutral-700/50 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{segment}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Create New Segment Option */}
            <div className="flex items-center gap-2">
              <Button
                variant={isCreatingNew ? "primary" : "ghost"}
                size="sm"
                onClick={() => {
                  setIsCreatingNew(!isCreatingNew);
                  setSelectedSegment('');
                }}
                icon={<Plus className="w-4 h-4" />}
                className={isCreatingNew ? "" : "text-neutral-300 hover:text-white hover:bg-neutral-700"}
              >
                {isCreatingNew ? 'Creating new segment' : 'Create new segment'}
              </Button>
            </div>

            {/* New Segment Input */}
            <AnimatePresence>
              {isCreatingNew && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    New segment name
                  </label>
                  <Input
                    type="text"
                    value={newSegmentName}
                    onChange={(e) => setNewSegmentName(e.target.value)}
                    placeholder="Enter segment name..."
                    autoFocus
                    className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-primary-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-600">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="flex-1 text-neutral-300 hover:text-white hover:bg-neutral-700"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading || (!selectedSegment && !newSegmentName.trim())}
              loading={loading}
              className="flex-1 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Add to Segment
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};

export default AddToSegmentModal;
