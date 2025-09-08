import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { Input } from '@components/atoms/Input';
import { 
  Plus, 
  X, 
  Filter, 
  Users, 
  Tag,
  Search,
  Sparkles
} from 'lucide-react';

interface SegmentFilter {
  id: string;
  type: 'segment' | 'status' | 'custom';
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'not_equals';
  value: string;
  label: string;
}

interface SegmentBuilderProps {
  filters: SegmentFilter[];
  onChange: (filters: SegmentFilter[]) => void;
  availableSegments: string[];
  previewCount?: number;
  onPreview: () => void;
}

const filterTypes = [
  { id: 'segment', label: 'Segment', icon: <Tag className="w-4 h-4" /> },
  { id: 'status', label: 'Status', icon: <Users className="w-4 h-4" /> },
  { id: 'custom', label: 'Custom Field', icon: <Filter className="w-4 h-4" /> }
];

const operators = [
  { id: 'equals', label: 'equals' },
  { id: 'contains', label: 'contains' },
  { id: 'startsWith', label: 'starts with' },
  { id: 'not_equals', label: 'does not equal' }
];

export const SegmentBuilder: React.FC<SegmentBuilderProps> = ({
  filters,
  onChange,
  availableSegments,
  previewCount,
  onPreview
}) => {
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<SegmentFilter>>({
    type: 'segment',
    operator: 'equals'
  });

  const addFilter = () => {
    if (newFilter.field && newFilter.value) {
      const filter: SegmentFilter = {
        id: Date.now().toString(),
        type: newFilter.type as SegmentFilter['type'],
        field: newFilter.field,
        operator: newFilter.operator as SegmentFilter['operator'],
        value: newFilter.value,
        label: `${newFilter.field} ${newFilter.operator} "${newFilter.value}"`
      };
      
      onChange([...filters, filter]);
      setNewFilter({ type: 'segment', operator: 'equals' });
      setShowAddFilter(false);
    }
  };

  const removeFilter = (id: string) => {
    onChange(filters.filter(f => f.id !== id));
  };

  const getFilterColor = (type: SegmentFilter['type']) => {
    switch (type) {
      case 'segment': return 'primary';
      case 'status': return 'secondary';
      case 'custom': return 'accent';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
            Segment Builder
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAddFilter(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Filter
        </Button>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {filters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Active Filters
            </p>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <motion.div
                  key={filter.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge
                    variant={getFilterColor(filter.type) as any}
                    className="flex items-center gap-2 pr-1"
                  >
                    <span>{filter.label}</span>
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Filter Form */}
      <AnimatePresence>
        {showAddFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                  Add New Filter
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddFilter(false)}
                  icon={<X className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Filter Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Type
                  </label>
                  <select
                    value={newFilter.type}
                    onChange={(e) => setNewFilter({ ...newFilter, type: e.target.value as SegmentFilter['type'] })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
                  >
                    {filterTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Field
                  </label>
                  {newFilter.type === 'segment' ? (
                    <select
                      value={newFilter.field || ''}
                      onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
                    >
                      <option value="">Select segment</option>
                      {availableSegments.map(segment => (
                        <option key={segment} value={segment}>
                          {segment}
                        </option>
                      ))}
                    </select>
                  ) : newFilter.type === 'status' ? (
                    <select
                      value={newFilter.field || ''}
                      onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
                    >
                      <option value="">Select status</option>
                      <option value="unsubscribed">Subscription Status</option>
                    </select>
                  ) : (
                    <Input
                      placeholder="Field name"
                      value={newFilter.field || ''}
                      onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                    />
                  )}
                </div>

                {/* Operator */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Operator
                  </label>
                  <select
                    value={newFilter.operator}
                    onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value as SegmentFilter['operator'] })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
                  >
                    {operators.map(op => (
                      <option key={op.id} value={op.id}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Value
                  </label>
                  {newFilter.type === 'status' && newFilter.field === 'unsubscribed' ? (
                    <select
                      value={newFilter.value || ''}
                      onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
                    >
                      <option value="">Select value</option>
                      <option value="true">Unsubscribed</option>
                      <option value="false">Active</option>
                    </select>
                  ) : (
                    <Input
                      placeholder="Filter value"
                      value={newFilter.value || ''}
                      onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowAddFilter(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addFilter}
                  disabled={!newFilter.field || !newFilter.value}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Filter
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      {filters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Segment Preview
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {previewCount !== undefined ? (
                    `${previewCount.toLocaleString()} contacts match these filters`
                  ) : (
                    'Click preview to see matching contacts'
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onPreview}
              icon={<Search className="w-4 h-4" />}
            >
              Preview
            </Button>
          </div>
  </motion.div>
      )}

      {/* Empty State */}
      {filters.length === 0 && !showAddFilter && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-2">
            No filters added yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Add filters to create a targeted segment of your contacts
          </p>
          <Button
            onClick={() => setShowAddFilter(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Your First Filter
          </Button>
        </div>
      )}
    </div>
  );
};

export default SegmentBuilder;