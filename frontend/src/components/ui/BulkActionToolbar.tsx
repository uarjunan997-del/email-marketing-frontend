import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { 
  X, 
  Trash2, 
  UserX, 
  UserCheck, 
  Download, 
  Tag,
  Mail
} from 'lucide-react';

interface BulkActionToolbarProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
  onUnsubscribe: () => void;
  onResubscribe: () => void;
  onExport: () => void;
  onAddToSegment: () => void;
  onSendEmail: () => void;
}

export const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedCount,
  onClear,
  onDelete,
  onUnsubscribe,
  onResubscribe,
  onExport,
  onAddToSegment,
  onSendEmail
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="glass dark:glass-dark rounded-2xl p-4 shadow-2xl border border-white/20 dark:border-neutral-800/20 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              {/* Selection count */}
              <div className="flex items-center gap-2">
                <Badge variant="gradient" className="flex items-center gap-1">
                  <span className="font-semibold">{selectedCount}</span>
                  <span>selected</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  icon={<X className="w-4 h-4" />}
                  className="text-neutral-500 hover:text-neutral-700"
                />
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600" />

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSendEmail}
                  icon={<Mail className="w-4 h-4" />}
                  className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/20"
                >
                  Send Email
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddToSegment}
                  icon={<Tag className="w-4 h-4" />}
                  className="text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-950/20"
                >
                  Add to Segment
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExport}
                  icon={<Download className="w-4 h-4" />}
                  className="text-accent-600 hover:text-accent-700 hover:bg-accent-50 dark:hover:bg-accent-950/20"
                >
                  Export
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUnsubscribe}
                  icon={<UserX className="w-4 h-4" />}
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                >
                  Unsubscribe
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResubscribe}
                  icon={<UserCheck className="w-4 h-4" />}
                  className="text-accent-600 hover:text-accent-700 hover:bg-accent-50 dark:hover:bg-accent-950/20"
                >
                  Resubscribe
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  icon={<Trash2 className="w-4 h-4" />}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionToolbar;